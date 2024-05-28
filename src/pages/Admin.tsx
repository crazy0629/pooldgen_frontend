import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { checkIsAdmin } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Tweet {
  tweet_id: string;
  content: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [winningBonus, setWinningBonus] = useState<string>("");
  const [retweetBonus, setRetweetBonus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [tweetId, setTweetId] = useState<string>("");
  const [tweetContent, setTweetContent] = useState<string>("");

  const [tweets, setTweets] = useState<Tweet[]>([]);

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

  const getDefaultTweets = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URI}/api/v1/get-tweets`
    );
    setTweets(response.data.tweets);
  };

  const addDefaultTweet = async () => {
    if (tweetId === "" || tweetContent === "")
      return toast.error("Please input twitter id or twitter content exactl!");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/v1/addtweet`,
        {
          tweet_id: tweetId,
          content: tweetContent,
        }
      );
      setTweets(response.data.tweets);
      setTweetId("");
      setTweetContent("");
      toast.success("New Tweet successfully added!");
    } catch (error: any) {
      console.log("adding tweet error => ", error);
      toast.error(error.response.data.err);
    }
  };

  useEffect(() => {
    const isAdmin = checkIsAdmin();
    if (!isAdmin) {
      navigate("/");
    }
    fetchBonusPoints();
    getDefaultTweets();
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
              <div className="col-lg-6">
                <div className="about-content">
                  <h2 className="sub-title bonus-title">Add New Tweet</h2>
                  <div>
                    <div>
                      <label>Tweet Id:</label>
                      <input
                        type="text"
                        value={tweetId}
                        onChange={(e: any) => {
                          setTweetId(e.target.value);
                        }}
                        className="bonus-input"
                      />
                    </div>
                    <div>
                      <label>Tweet Content:</label>
                      <textarea
                        value={tweetContent}
                        onChange={(e: any) => {
                          setTweetContent(e.target.value);
                        }}
                        className="bonus-input"
                      />
                    </div>
                    <button
                      className="primary-btn update-btn"
                      onClick={addDefaultTweet}
                    >
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="about-wrapper">
            <div className="row justify-content-between gy-4">
              <div className="col-lg-6">
                <div className="about-content">
                  <h2 className="sub-title bonus-title">All tweets</h2>
                  {tweets.length !== 0 ? (
                    tweets.map((tweet: Tweet, i: number) => {
                      return (
                        <p key={i}>
                          <div className="row">
                            <div className="col-md-6">Twitter Id:</div>
                            <div className="col-md-6">{tweet.tweet_id}</div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">Twitter Content:</div>
                            <div className="col-md-6">{tweet.content}</div>
                          </div>
                        </p>
                      );
                    })
                  ) : (
                    <p>No Data</p>
                  )}
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
