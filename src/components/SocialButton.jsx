const SocialButton = ({ platform, onClick }) => {
    const platformImages = {
        Google: "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA",
        GitHub: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    };

    return (
        <button onClick={onClick} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
            <img src={platformImages[platform]} alt={platform} className="h-5" />
            <span>{platform}</span>
        </button>
    );
};

export default SocialButton;



