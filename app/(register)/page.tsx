import SignInComponent from "@/components/SignInComponent/SignInComponent";

export default function Home() {
  return (
    <div>
      <h1 className="absolute text-blue-500 top-4 left-4 text-2xl">
        Ai Agency
      </h1>
      <SignInComponent />
    </div>
  );
}
