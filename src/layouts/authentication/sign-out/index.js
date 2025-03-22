import { useEffect } from "react";
import { getAuth } from "firebase/auth";

import { firebaseApp } from "../../../firebase";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const auth = getAuth(firebaseApp);

export default function SignOut() {
  const history = useHistory();

  useEffect(() => {
    auth.currentUser.getIdToken().then((user) => {
      if (user) {
        auth.signOut().then(() => {
          setTimeout(() => {
            history.push("/authentication/sign-in");
          }, 1500);
        });
      }
    });
  }, []);

  return <div />;
}
