
"use server";

type FormState = {
  success: boolean;
  message: string;
  error: string;
};

export async function greet(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  // Check required fields
  if (email?.trim()==="" || !email) {
    return {
      success: false,
      message: "",
      error: "All fields are required.",
    };
  }

  // Password validation
  if (!password || password.length < 6) {
    return {
      success: false,
      message: "",
      error: "Password must be at least 6 characters.",
    };
  }

  // Log email on server
  console.log("User Email:", email);

  return {
    success: true,
    message: `Hello, ${name}! Your Email is ${email}. Thanks for submitting!`,
    error: "",
  };
}
