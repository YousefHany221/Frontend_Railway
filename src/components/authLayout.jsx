import image from "../assets/img1.png";
import LanguageSwitcher from "./languageSwitcher";

function AuthLayout({ children }) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl min-h-[700px] bg-white rounded-[32px] flex shadow-xl">

        <img src={image} alt="" className="w-1/2 object-cover hidden lg:block rounded-r-none rounded-[32px]" />

        <div className="w-full lg:w-1/2 flex flex-col items-center justify-start py-8 px-10 overflow-y-auto relative">
          
          <div className="w-full flex justify-end mb-2">
            <LanguageSwitcher />
          </div>

          {children}
        </div>

      </div>
    </div>
  );
}

export default AuthLayout;