import litecodeGif from "../../assets/litecode.gif";
import litecodeVid from "../../assets/litecode.mp4";

import "./HomePage.scss";

const HomePage = () => {
  return (
    <main>
      <div className="about-container">
        <div className="about">
          <h1>Welcome to LiteCode</h1>
          <p>
            LiteCode is a working demo of LeetCode, an online platform for
            coding challenges and interview preparations. LiteCode provides user
            authentication, code submission and execution features, with a
            unique architecture involving Kubernetes and RabbitMQ.
          </p>
        </div>
        <img src={litecodeGif} alt="litecode working architecture gif" />
      </div>
      <div className="demo-video-container">
        <h1>Demo Video</h1>
        <video src={litecodeVid} muted autoPlay loop />
      </div>
    </main>
  );
};

export default HomePage;
