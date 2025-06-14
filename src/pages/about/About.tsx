import './About.scss';
import rsLogo from '../../assets/images/rss-logo.svg';

const About = () => {
    return (
        <div className="about">
            <div className="about__inner">
                <div className="about__title">
                    <h1 className="about__heading">About Our Team</h1>
                    <p className="about__description">
                        We're a passionate team of developers committed to
                        building the best gaming marketplace. Our goal is to
                        connect gamers with their favorite titles through a
                        user-friendly and powerful platform.
                    </p>
                </div>

                <div className="about__rsschool">
                    <div className="about__rsschool-card">
                        <div className="about__rsschool-content">
                            <div className="about__rsschool-logo">
                                <img
                                    className="about__rsschool-img"
                                    src={rsLogo}
                                    alt="RS School"
                                />
                            </div>
                            <h2 className="about__rsschool-heading">
                                Powered by RS School
                            </h2>
                            <p className="about__rsschool-description">
                                This project was developed as part of the RS
                                School JavaScript/Front-end course. RS School is
                                a free, community-based education program
                                conducted by The Rolling Scopes developer
                                community.
                            </p>
                            <a
                                href="https://rs.school/"
                                target="_blank"
                                className="about__rsschool-link"
                                rel="noopener noreferrer"
                            >
                                Visit RS school
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
