
import github from "/github-logo.svg";


export default function Footer() {
    return (
        <>
            <footer className="bg-secondary text-primary py-3">
                <div className="container mx-auto text-center text-sm flex items-center justify-between px-3">
                    <div />
                    <p>&copy; {new Date().getFullYear()} OrariAperti. All rights reserved.</p>
                    <img
                        className="hover:cursor-pointer"
                        onClick={() => window.open('https://github.com/IMS-coding-projects/m223', '_blank')}
                        src={github}
                        alt="GitHub Repository"
                        style={{ width: '25px', height: '25px' }}
                    />
                </div>
            </footer>
        </>
    );
}

