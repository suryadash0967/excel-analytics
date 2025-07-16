import { Hatch } from 'ldrs/react';
import 'ldrs/react/Hatch.css';

export default function Loader() {
  return (
    <div className="loader-container">
      <Hatch
        size="28"
        stroke="4"
        speed="3.5"
        color="currentColor"
      />
    </div>
  );
}
