import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { checkIsAdmin } from "../utils/helper";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [winningBonus, setWinningBonus] = useState<string>("");
  const [retweetBonus, setRetweetBonus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const handleWinningBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccess("");
    const value = e.target.value;
    if (!isNaN(Number(value)) && Number(value) >= 0) {
      setWinningBonus(value);
    } else {
      setError("Please enter a valid non-negative number for winning bonus.");
    }
  };

  const handleRetweetBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccess("");
    const value = e.target.value;
    if (!isNaN(Number(value)) && Number(value) >= 0) {
      setRetweetBonus(value);
    } else {
      setError("Please enter a valid non-negative number for retweet bonus.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (winningBonus === "" || retweetBonus === "") {
      setError("Both fields are required.");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/v1/score/update-bonus-points`,
        {
          winning_bonus: parseFloat(winningBonus),
          retweet_bonus: parseFloat(retweetBonus),
        }
      );
      setSuccess("Bonuses updated successfully.");
    } catch (error) {
      setError("Error updating bonuses. Please try again.");
    }
  };
  const fetchBonusPoints = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URI}/api/v1/score/get-bonus-points`
    );
    const bonuses = response?.data?.bonus;
    if (bonuses) {
      setWinningBonus(bonuses?.winning_bonus);
      setRetweetBonus(bonuses?.retweet_bonus);
    }
  };

  useEffect(() => {
    const isAdmin = checkIsAdmin();
    if (!isAdmin) {
      navigate("/");
    }
    fetchBonusPoints();
  }, []);
  return (
    <>
      <div>
        <div className="container">
          <div className="about-wrapper">
            <div className="row justify-content-between gy-4">
              <div className="col-lg-6">
                <div className="about-content">
                  <h2 className="sub-title bonus-title">Update Bonuses</h2>
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label>Winning Bonus:</label>
                      <input
                        type="text"
                        value={winningBonus}
                        onChange={handleWinningBonusChange}
                        className="bonus-input"
                      />
                    </div>
                    <div>
                      <label>Retweet Bonus:</label>
                      <input
                        type="text"
                        value={retweetBonus}
                        onChange={handleRetweetBonusChange}
                        className="bonus-input"
                      />
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}
                    <button type="submit" className="primary-btn update-btn">
                      <span>UPDATE</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
