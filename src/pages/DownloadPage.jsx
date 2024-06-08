import Button from "@/components/Button";
import { downloadImage, wanderLargeImage, wanderSmallImage } from "@/utils";
const DownloadPage = () => {
  return (
    <main className="container">
      <div
        className="bg xl:hidden"
        style={{ backgroundImage: `url(${wanderSmallImage})` }}
      />
      <div
        className="bg hidden xl:block"
        style={{ backgroundImage: `url(${wanderLargeImage})` }}
      />
      <div className="fixed top-1/2 w-full max-w-md xl:max-w-xl flex flex-col gap-10 items-center p-6 xl:p-12">
        <Button text="!! Browser not supported !!" />
        <a href="https://apps.apple.com/app/apple-store/id6474634049?pt=126456033&ct=website&mt=8">
          <img className="w-full px-12" src={downloadImage} />
        </a>
      </div>
    </main>
  );
};

export default DownloadPage;
