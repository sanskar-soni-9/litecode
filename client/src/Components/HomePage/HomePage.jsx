import { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    window.location.href = "/problemset/all";
  });

  return <main></main>;
};

export default HomePage;
