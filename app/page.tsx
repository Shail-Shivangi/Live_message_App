// import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// export default function Home() {
//   return (
//     <div className="flex h-screen items-center justify-center">
//       <SignedOut>
//         <SignInButton />
//       </SignedOut>

//       <SignedIn>
//         <div className="flex flex-col items-center gap-4">
//           <UserButton />
//           <p>Welcome to Live Chat</p>
//         </div>
//       </SignedIn>
//     </div>
//   );
// }

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <SignedOut>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Live Chat App</h1>
          <SignInButton>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="text-center space-y-4">
          <UserButton />
          <Link href="/chat">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold">
              Go to Chat
            </button>
          </Link>
        </div>
      </SignedIn>
    </div>
  );
}