import React from "react";

const messages = {
  en: { title: "Something went wrong.", reload: "Reload RTMN" },
  de: { title: "Etwas ist schiefgelaufen.", reload: "RTMN neu laden" },
  uk: { title: "Щось пішло не так.", reload: "Перезавантажити RTMN" },
};

function currentLanguage() {
  try {
    const language = localStorage.getItem("rtmn-lang");
    return ["en", "de", "uk"].includes(language) ? language : "en";
  } catch {
    return "en";
  }
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("RTMN interface error", error);
  }

  render() {
    if (this.state.hasError) {
      const text = messages[currentLanguage()];
      return <main className="app-error" role="alert"><p>RTMN</p><h1>{text.title}</h1><button className="button button-dark" onClick={() => window.location.reload()}>{text.reload}</button></main>;
    }

    return this.props.children;
  }
}
