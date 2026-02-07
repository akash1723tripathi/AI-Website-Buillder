import { useState } from "react"
import { AuthView } from "@daveyplate/better-auth-ui"

type AuthViewState = "SIGN_IN" | "SIGN_UP" | "FORGOT_PASSWORD" | "MAGIC_LINK" | "EMAIL_VERIFICATION";

export default function AuthPage() {
      const [currentView, setCurrentView] = useState<AuthViewState>("SIGN_IN");

      return (
            <main className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
                  {/* 1. THE OUTER CONTAINER: This holds the border and shadow for everything */}
                  <div className="w-full max-w-[400px] bg-black border border-indigo-900/50 rounded-lg shadow-2xl overflow-hidden ring-1 ring-indigo-900/50">

                        {/* 2. THE TOP: The Auth Form itself */}
                        <div className="p-6 pb-2">
                              <AuthView
                                    view={currentView}
                                    onNavigate={(val: string) => setCurrentView(val as AuthViewState)}
                                    classNames={{
                                          // We strip the library's default borders so it fits inside our container
                                          base: "border-none shadow-none bg-transparent p-0",
                                          footer: "hidden" // Hide the broken footer
                                    }}
                              />
                        </div>

                        {/* 3. THE BOTTOM: Your Manual Footer (Styled to match seamlessly) */}
                        <div className=" p-4 pt-2 pb-6 text-center text-sm text-gray-400">
                              {currentView === "SIGN_IN" ? (
                                    <p>
                                          Don't have an account?{" "}
                                          <button
                                                onClick={() => setCurrentView("SIGN_UP")}
                                                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline"
                                          >
                                                Sign Up
                                          </button>
                                    </p>
                              ) : currentView === "SIGN_UP" ? (
                                    <p>
                                          Already have an account?{" "}
                                          <button
                                                onClick={() => setCurrentView("SIGN_IN")}
                                                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline"
                                          >
                                                Sign In
                                          </button>
                                    </p>
                              ) : (
                                    <button
                                          onClick={() => setCurrentView("SIGN_IN")}
                                          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline"
                                    >
                                          Back to Sign In
                                    </button>
                              )}
                        </div>
                  </div>
            </main>
      )
}