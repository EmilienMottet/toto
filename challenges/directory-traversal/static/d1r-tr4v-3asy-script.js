function viewOtherTab(index) {
    const nouvelleURL = `${window.location.origin}${window.location.pathname}/view?galerie=${index}`;
    window.location.href = nouvelleURL;
}
