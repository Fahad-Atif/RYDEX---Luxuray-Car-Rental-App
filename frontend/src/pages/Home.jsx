import React from "react";
import HeroSection from "../components/HeroSection";
import Featured from "../components/Featured";
import Banner from "../components/Banner";
import Testimonials from "../components/Testimonials";
import NewsLetter from "../components/NewsLetter";
// import Footer from "../components/Footer";

function Home() {


  return (
    <div>
      <HeroSection />
      <Featured/>
      <Banner />
      <Testimonials/>
      <NewsLetter/>
      
    </div>
  );
}

export default Home;
