import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <div className="max-w-[1600px] mx-auto w-full p-8">
      home page
    </div>
  );
}