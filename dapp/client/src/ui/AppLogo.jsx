import PropTypes from "prop-types";

function AppLogo({ isNav }) {
  return (
    <>
      <img
        src="/images/logo-medchain.png"
        alt="MedChain"
        className={
          isNav ? `inline max-w-10 md:max-w-16` : `inline max-w-16 md:max-w-20`
        }
      />
      <p
        className={
          isNav
            ? `text-md font-semibold text-cyan-600 md:text-xl`
            : `text-xl font-semibold text-cyan-600 md:text-3xl`
        }
      >
        MedChain
      </p>
    </>
  );
}
AppLogo.propTypes = { isNav: PropTypes.bool };
export default AppLogo;
