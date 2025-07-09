import { useEffect } from "react";

const useDocumentTitle = (title: string, restoreOnUnmount = false) => {
  const defaultTitle = document.title;

  useEffect(() => {
    document.title = title;

    return () => {
      if (restoreOnUnmount) {
        document.title = defaultTitle;
      }
    };
  }, [title, restoreOnUnmount]);
};

export default useDocumentTitle;
