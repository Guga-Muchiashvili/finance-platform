import Cookies from "js-cookie";

const signIn = (password: string): boolean => {
  if (password === process.env.NEXT_PUBLIC_HIDDEN_PASSWORD) {
    const now = new Date();
    now.setDate(now.getDate() + 3);

    Cookies.set("authToken", "your_auth_token_value", {
      expires: 3, // Expires in 3 days
      path: "/",
      sameSite: "Lax", // Better cross-origin behavior
    });

    return true;
  }

  return false;
};

export default signIn;
