import React from 'react';
import Layout from '../Layouts/Layout';
import bankTree from '../assets/bank-tree.jpeg';
import iconChat from '../assets/icon-chat.png';
import iconMoney from '../assets/icon-money.png';
import iconSecurity from '../assets/icon-security.png';

/**
 * HomePage component displays the home page of the application.
 * It includes a hero section with promotional content and a features section.
 *
 * @component
 * @example
 * return (
 *   <HomePage />
 * )
 */
const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Hero section with background image */}
      <div
        className="relative h-[300px] bg-cover bg-[0_-50px] bg-no-repeat custom:h-[25rem] custom:bg-[0_33%]"
        style={{ backgroundImage: `url(${bankTree})` }}
      >
        <section className="relative top-8 m-auto w-[264px] bg-white p-8 text-left custom:absolute custom:right-[50px] custom:top-[50px] custom:m-8 custom:w-[364px]">
          <h2 className="sr-only">Promoted Content</h2>
          <p className="m-0 text-base/[18px] font-bold custom:text-2xl/7">
            No fees.
          </p>
          <p className="m-0 text-base/[18px] font-bold custom:text-2xl/7">
            No minimum deposit.
          </p>
          <p className="m-0 text-base/[18px] font-bold custom:text-2xl/7">
            High interest rates.
          </p>
          <p className="custom:[19.2px] mt-[14.4px] text-[.9rem]/4 custom:mt-[19.2px] custom:text-[1.2rem]/[22px]">
            Open a savings account with Argent Bank today!
          </p>
        </section>
      </div>
      {/* Features section */}
      <section className="flex flex-col custom:flex-row">
        <h2 className="sr-only">Features</h2>
        <div className="flex-1 p-10">
          <img
            src={iconChat}
            alt="Chat Icon"
            className="w-[152px] rounded-full border-[10px] border-secondary p-4"
          />
          <h3 className="mb-2 mt-[20px] text-xl font-bold">
            You are our #1 priority
          </h3>
          <p className="my-4 text-center">
            Need to talk to a representative? You can get in touch through our
            24/7 chat or through a phone call in less than 5 minutes.
          </p>
        </div>
        <div className="flex-1 p-10">
          <img
            src={iconMoney}
            alt="Money Icon"
            className="w-[152px] rounded-full border-[10px] border-secondary p-4"
          />
          <h3 className="mb-2 mt-[20px] text-xl font-bold">
            More savings means higher rates
          </h3>
          <p className="text-center">
            The more you save with us, the higher your interest rate will be!
          </p>
        </div>
        <div className="flex-1 p-10">
          <img
            src={iconSecurity}
            alt="Security Icon"
            className="w-[152px] rounded-full border-[10px] border-secondary p-4"
          />
          <h3 className="mb-2 mt-[20px] text-xl font-bold">
            Security you can trust
          </h3>
          <p className="text-center">
            We use top of the line encryption to make sure your data and money
            is always safe.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
