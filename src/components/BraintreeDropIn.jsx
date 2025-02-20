import { useEffect, useRef, useState } from "react";
import dropin from "braintree-web-drop-in";

export function BraintreeDropIn ({ clientToken, onInstanceReady }) {
  const dropinContainer = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientToken || !dropinContainer.current) return;

    dropin.create(
      {
        authorization: clientToken,
        container: dropinContainer.current,
      },
      (err, instance) => {
        if (err) {
          console.error("Braintree initialization error:", err);
          return;
        }

        setLoading(false);
        onInstanceReady(instance); // Pass the instance back to the parent
      }
    );

    return () => {
      if (dropinContainer.current) {
        dropinContainer.current.innerHTML = "";
      }
    };
  }, [clientToken, onInstanceReady]);

  return (
    <>
      {loading && <p>Loading payment gateway...</p>}
      <div ref={dropinContainer}></div>
    </>
  );
};