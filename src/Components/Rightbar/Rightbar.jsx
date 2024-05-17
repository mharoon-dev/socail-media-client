import "./rightbar.css";
import Online from "../Online/Online.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import users from "../../dummyData.js";
import { deployedUrl } from "../../utils/urls";

const api = axios.create({
  baseURL: deployedUrl,
});

export default function Rightbar({ user }) {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [followed, setFollowed] = useState(
    currentUser?.data?.followings?.map((u) => u._id).includes(user?._id) ? true : false
  );

  useEffect(() => {
    const getFriends = async () => {
      if (user?._id) {
        try {
          const friendList = await api.get(`/users/friends/${user._id}`);
          setFriends(friendList.data.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    getFriends();
  }, [user]);

  const handleFollow = async () => {
    try {
      console.log(await followed);
      if (followed) {
        await api.put(`/users/${user._id}/unfollow`, {
          userId: currentUser.data._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await api.put(`/users/${user._id}/follow`, {
          userId: currentUser.data._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
      console.error(err);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have birthday today
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.data.username && (
          <button onClick={handleFollow} className="rightbarFollowButton">
            {followed ? "Unfollow" : "Follow"}
          </button>
        )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city || "New York"}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from || "Madrid"}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship || "Single"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((u) => (
            <Link
              to={`/profile/${u.username}`}
              style={{ textDecoration: "none" }}
              key={u.id}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    u.profilePicture
                      ? u.profilePicture
                      : `${PF}person/noAvatar.png`
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{u.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
