function SmallSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto flex h-6 w-6 justify-center">
        <div className="lds-circle">
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default SmallSpinner;
