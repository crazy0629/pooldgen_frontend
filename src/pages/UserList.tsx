import { useEffect, useState } from "react";
import axios from "axios";
import { checkIsAdmin } from "../utils/helper";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URI}/api/v1/get-users`
    );
    if (response?.data?.users?.length > 0) {
      setUsers(response.data.users);
    }
  };

  useEffect(() => {
    const isAdmin = checkIsAdmin();
    if (!isAdmin) {
      navigate("/");
    }
    fetchUsers();
  }, []);
  return (
    <>
      <div>
        <div className="container">
          <div className="about-wrapper">
            <div className="row justify-content-between gy-4">
              <div className="col-lg-6">
                <div>
                  <h2 className="sub-title bonus-title">Connected Users</h2>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr className="user-table-header">
                        <th>User</th>
                        <th>POOL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(
                        (
                          user: { screen_name: String; total_score: Number },
                          index
                        ) => (
                          <tr key={index} className="user-table-row">
                            <td>{user.screen_name}</td>
                            <td>{String(user.total_score)}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;
