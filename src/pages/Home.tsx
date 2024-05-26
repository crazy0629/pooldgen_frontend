import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";

import { useCopyToClipboard } from "usehooks-ts";
import toast from "react-hot-toast";
import TwitterLogin from "react-twitter-auth";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [isReady, setReady] = useState(false);
  const [user_id, setUserId] = useState("");
  const [screen_name, setScreenName] = useState("");
  const [total_score, setTotalScore] = useState<number>(0);
  const [showRetweet, setShowRetweet] = useState<Boolean>(false);
  const [copiedText, copy] = useCopyToClipboard();
  const defaultPostTxt = "Follow Us";

  const handleCopy = (text: string) => {
    copy(text)
      .then(() => {
        console.log("Copied!", { copiedText });
        toast.success("Copied");
      })
      .catch((error) => {
        console.log("Failed to copy!", error);
      });
  };

  const onFailed = (err: any) => {
    console.log("failed error => ", err);
    toast.error("failed");
  };

  const onSuccess = (response: any) => {
    response
      .json()
      .then((body: any) => {
        localStorage.setItem("userDetails", JSON.stringify(body));
        setUserDetails(body);
      })
      .catch((error: unknown) => {
        console.error("login failed", error);
        toast.error("Login failed!");
      });
  };

  const setUserDetails = (data: any) => {
    const { user_id, screen_name, verify, total_score } = data;

    setUserId(user_id);
    setScreenName(screen_name);
    setTotalScore(total_score);

    if (verify) {
      setShowRetweet(true);
      setReady(true);
    }
  };
  const handleDefaultPost = async () => {
    if (user_id === "" || screen_name === "")
      return toast.error("Please login first!");
    const twitterUrl = `https://twitter.com/intent/tweet?text=${defaultPostTxt}`;

    window.open(
      twitterUrl,
      "Twitter Share",
      "width=600,height=400,resizable=yes,scrollbars=yes,status=yes"
    );

    setTimeout(async () => {
      try {
        const tweetres = await axios.post(
          `${import.meta.env.VITE_SERVER_URI}/api/v1/auth/tweet`,
          {
            user_id,
          }
        );
        if (tweetres && tweetres.data && tweetres.data.success) {
          updateVerified();
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URI}/api/v1/score/get-bonus-points`
          );
          const retweet_bonus = response?.data?.bonus?.retweet_bonus ?? 0;
          const res = await axios.post(
            `${import.meta.env.VITE_SERVER_URI}/api/v1/score/update-user-score`,
            {
              user_id,
              score: retweet_bonus,
            }
          );
          updateTotalScore(res?.data?.updatedUser?.total_score);
          setReady(true);
          setShowRetweet(false);
          setTotalScore(res?.data?.updatedUser?.total_score);
        }
      } catch (error) {
        toast.error("Tweeting error!");
      }
    }, 2000);
  };

  const followPool = async () => {
    if (user_id === "" || screen_name === "")
      return toast.error("Please login first!");
    const twitterUrl = `https://twitter.com/intent/follow?screen_name=bitsportgaming`;

    window.open(
      twitterUrl,
      "Twitter Share",
      "width=600,height=400,resizable=yes,scrollbars=yes,status=yes"
    );

    setTimeout(async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_URI}/api/v1/auth/follow`,
          {
            user_id,
          }
        );
        if (res && res.data && res.data.success) {
          updateVerified();
          setReady(true);
        }
      } catch (error) {
        toast.error("Following error!");
      }
    }, 2000);
  };

  useEffect(() => {
    if (isReady) {
      setReady(true);
      if (!showRetweet) {
        toast.success("Congratulation! You can play game for now!");
      }
    }
  }, [isReady]);

  useEffect(() => {
    const userData = localStorage.getItem("userDetails");
    if (userData) {
      setShowRetweet(true);
      setUserDetails(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    window.onmessage = handleMessage;
    return () => {
      window.onmessage = null;
    };
  }, [user_id]);

  const handleMessage = async (e: MessageEvent) => {
    if (e?.data?.score > 0) {
      try {
        //get winning points
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}/api/v1/score/get-bonus-points`
        );
        const winning_bonus = response?.data?.bonus?.winning_bonus ?? 0;

        //update user bonus
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_URI}/api/v1/score/update-user-score`,
          {
            user_id,
            score: e?.data?.score + winning_bonus,
          }
        );
        setTotalScore(res?.data?.updatedUser?.total_score);
        updateTotalScore(res?.data?.updatedUser?.total_score);
      } catch (error) {
        console.error("Error following user:", error);
      }
    }
    setShowRetweet(true);
  };

  const updateTotalScore = (score: Number) => {
    const userdata = localStorage.getItem("userDetails");
    if (userdata) {
      const parsed = JSON.parse(userdata);
      parsed.total_score = score;
      localStorage.setItem("userDetails", JSON.stringify(parsed));
    }
  };
  //update verify flag in localstorage
  const updateVerified = () => {
    const userdata = localStorage.getItem("userDetails");
    if (userdata) {
      const parsed = JSON.parse(userdata);
      parsed.verify = true;
      localStorage.setItem("userDetails", JSON.stringify(parsed));
    }
  };
  return (
    <>
      <Header points={total_score} />
      <div>
        <div>
          <section className="banner">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="banner-content"></div>
                </div>
              </div>
            </div>
          </section>
          <center>
            <button className="fancy-btn">
              <a
                href="#"
                target="_blank"
                style={{ color: "white", textDecoration: "none" }}
              >
                Degen.Fund
              </a>
            </button>
            <button className="fancy-btn">
              <a
                href="#"
                target="_blank"
                style={{ color: "white", textDecoration: "none" }}
              >
                DexScreener
              </a>
            </button>
            <button className="fancy-btn">
              <a
                href="https://x.com/poolgamesol"
                target="_blank"
                style={{ color: "white", textDecoration: "none" }}
              >
                Twitter
              </a>
            </button>
            <button className="fancy-btn">
              <a
                href="https://t.me/poolgamesol"
                target="_blank"
                style={{ color: "white", textDecoration: "none" }}
              >
                Telegram
              </a>
            </button>

            <button
              className="fancy-btn"
              onClick={() =>
                handleCopy("Fu5TEtXefpJMxhGdTUYDcuYq8qTxtRTESuUbJbuDvrg3")
              }
            >
              Copy Contract Address
            </button>
          </center>

          <div className="revolution">
            <div className="container">
              <div className="text-center mb-3 mb-md-4">
                <span className="section-title linear-text">
                  Welcome to Pool Degens - Even the WideLife takes a Shot
                </span>
                {!isReady ? (
                  <div className="sub-title">
                    <br className="d-none d-md-block" />3 Steps to start{" "}
                    <span className="linear-text"> Playing</span>
                  </div>
                ) : (
                  <div>
                    <div className="sub-title">
                      <br className="d-none d-md-block" />
                      Start<span className="linear-text"> Playing</span>
                    </div>
                    <div className="sub-title score-title">
                      Score :
                      <span className="linear-text">
                        {" "}
                        {String(total_score)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="game-container">
                {!isReady && (
                  <div className="twitter-btns-container">
                    <div className="twitter-container-overlay"></div>
                    {!isReady && (
                      <div className="container d-flex justify-content-around pb-5 gx-1">
                        <TwitterLogin
                          loginUrl={`${
                            import.meta.env.VITE_SERVER_URI
                          }/api/v1/auth/twitter`}
                          onFailure={onFailed}
                          onSuccess={onSuccess}
                          requestTokenUrl={`${
                            import.meta.env.VITE_SERVER_URI
                          }/api/v1/auth/twitter/reverse`}
                          showIcon={true}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                        >
                          <span className="primary-btn">
                            <span>Connect twitter</span>
                          </span>
                        </TwitterLogin>
                        <button className="primary-btn" onClick={followPool}>
                          <span>Follow Pool Degen</span>
                        </button>
                        <button
                          className="primary-btn"
                          onClick={handleDefaultPost}
                        >
                          <span>Retweet Default Tweet</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {showRetweet && (
                  <div className="twitter-btns-container">
                    <div className="twitter-container-overlay"></div>

                    <button className="primary-btn" onClick={handleDefaultPost}>
                      <span>Retweet Default Tweet</span>
                    </button>
                  </div>
                )}
                <iframe
                  src="https://portal.poolgame.meme/?c=${1}&u=${user_id}"
                  width="100%"
                  height="600px"
                  scrolling="no"
                ></iframe>
              </div>

              <div className="row gy-4 justify-content-center align-items-center">
                <div className="col-lg-6 col-xl-4 text-center">
                  <img
                    src="images/degenwolf.png"
                    className="revolution-img"
                    alt="revolution"
                  />
                </div>
                <div className="col-lg-6 col-xl-6 position-relative">
                  <div className="card-wrapper mb-3">
                    <div className="revolution-card">
                      <h3 className="linear-text">
                        Meet Degen Bryan - The Wolf of Solana Pool 🎱🐺
                      </h3>
                      <p>
                        As Degen Bryan takes his first shot, the balls scatter
                        like digital tokens in the decentralized wilderness.
                        With each pocketed ball, Bryan's grin widens, knowing
                        that every successful shot brings not only victory but
                        also an increase in his digital net worth.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="left-circle top-50 start-50 translate-middle"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="about" id="aboutUs">
          <div className="container">
            <div className="about-wrapper">
              <div className="row justify-content-between gy-4">
                <div className="col-lg-6">
                  <div className="about-content">
                    <h2 className="sub-title">
                      Join the<span className="linear-text"> $POOL Party</span>
                    </h2>
                    <p className="text-white">
                      While $POOL may have started as a meme project, it's not
                      all fun and games. Our flagship utility, an 8-ball pool
                      game like no other, allows players to dive into the
                      digital pool hall and compete for glory, rewards, and
                      bragging rights. But beware - with our animal mascots at
                      the helm, expect the unexpected and prepare for a wild
                      ride!
                    </p>
                    <button className="primary-btn">
                      <span>Buy $POOL</span>
                    </button>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="about-coin text-center">
                    <img
                      src="images/partyguys.png"
                      className="img-fluid"
                      alt="coin-img"
                    />
                  </div>
                </div>
              </div>
            </div>

            <center>
              {" "}
              <span className="section-title linear-text">Meet the Pack</span>
            </center>
            <div className="row gy-4">
              <div className="col-lg-6">
                <div className="card-wrapper">
                  <div className="service-card">
                    <div>
                      <img src="images/doggo.png" alt="" />
                    </div>
                    <div>
                      <h3>The Underdog Dasher</h3>
                      <p>
                        With a cue stick held firmly between his teeth, the
                        Underdog Dasher defies expectations with every shot.
                        Watch as this canine contender sinks balls with
                        precision and style, proving that even the smallest pups
                        have big dreams.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card-wrapper">
                  <div className="service-card">
                    <div>
                      <img src="images/racoon.png" alt="" />
                    </div>
                    <div>
                      <h3>The Raccoon Hustler</h3>
                      <p>
                        Behind that mask lies the eyes of a hustler, ready to
                        outsmart any opponent that crosses his path. With a
                        flick of his tail and a mischievous grin, the Raccoon
                        Hustler plays the game like a true master of deception.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card-wrapper">
                  <div className="service-card">
                    <div>
                      <img src="images/wolf.png" alt="" />
                    </div>
                    <div>
                      <h3>The Wolf of the Table</h3>
                      <p>
                        Silent and calculating, the Wolf of the Table prowls the
                        green felt with an air of confidence. Every shot is
                        executed with precision, earning the respect of both
                        friend and foe alike in the wild world of $POOL.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card-wrapper">
                  <div className="service-card">
                    <div>
                      <img src="images/zebra.png" alt="" />
                    </div>
                    <div>
                      <h3>Zara the Zebra</h3>
                      <p>
                        Enter the arena with Zara the Zebra, known for her
                        impeccable aim and striking presence. With each shot,
                        Zara leaves her mark on the digital pool landscape,
                        proving that stripes and style go hand in hoof.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="counter">
          <div className="container">
            <div className="row gy-4">
              <div className="col-sm-6 col-lg-3">
                <div className="card-wrapper">
                  <div className="revolution-card text-center">
                    <h3 className="linear-text">10B</h3>
                    <p>Supply</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card-wrapper">
                  <div className="revolution-card text-center">
                    <h3 className="linear-text">LP</h3>
                    <p>Locked</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card-wrapper">
                  <div className="revolution-card text-center">
                    <h3 className="linear-text">Live</h3>
                    <p>Game / Utility</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card-wrapper">
                  <div className="revolution-card text-center">
                    <h3 className="linear-text">100%</h3>
                    <p>Community Driven</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="left-circle"></div>
          <div className="right-circle"></div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
