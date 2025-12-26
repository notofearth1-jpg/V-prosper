import React, { useState } from "react";

interface IBiometricAuthProps {
  onAuthenticated: () => void;
}

const BiometricAuthComponent: React.FC<IBiometricAuthProps> = ({
  onAuthenticated,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleBiometricAuth = async () => {
    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "Your App Name",
          },
          user: {
            id: new Uint8Array(32),
            name: "User Name",
            displayName: "User Display Name",
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          timeout: 60000,
          excludeCredentials: [],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            requireResidentKey: false,
            userVerification: "required",
          },
          attestation: "none",
        },
      });

      // Authentication successful
      console.log("Authentication successful:", credential);
      onAuthenticated();
    } catch (error) {
      console.error("Biometric authentication failed:", error);
      setErrorMessage("Biometric authentication failed. Please try again.");
    }
  };

  return (
    <div>
      <button onClick={handleBiometricAuth}>
        Authenticate with Biometrics
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default BiometricAuthComponent;
