/* eslint-disable react/prop-types */
const Heading = ({ children }) => {
  return (
    <div className="mx-auto my-8 flex w-3/4 items-center">
      <div className="flex-grow border-y-2 border-t border-cyan-600"></div>
      <h1 className="mx-4 text-center text-2xl font-bold text-cyan-900">
        {children}
      </h1>
      <div className="flex-grow border-y-2 border-t border-cyan-600"></div>
    </div>
  );
};

export default Heading;
