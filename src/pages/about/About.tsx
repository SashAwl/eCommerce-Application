import './About.scss';
import rsLogo from '../../assets/images/rss-logo.svg';
import alexandra from '../../assets/images/alexandra.jpeg';
import alexandr from '../../assets/images/alexandr.jpeg';
import alina from '../../assets/images/alina.jpeg';

interface TeamMember {
    name: string;
    role: string;
    bio: string;
    photo: string;
    githubUrl: string;
    contributions: string[];
}

const About = () => {
    const teamMembers: TeamMember[] = [
        {
            name: 'Alexandra',
            role: 'Frontend Developer',
            bio: 'Our coordinator and frontend developer. She united the team, built the project infrastructure, and kept everyone energized and on track.',
            photo: alexandra,
            githubUrl: 'https://github.com/SashAwl',
            contributions: [
                'Frontend Architecture',
                'API Integration',
                'Main Page',
                'Catalog Page',
            ],
        },
        {
            name: 'Alexandr',
            role: 'Frontend Developer',
            bio: 'The technical backbone of the project. Reliable, precise, always on time. He implemented most of the business logic and stepped in to help others when things went wrong.',
            photo: alexandr,
            githubUrl: 'https://github.com/alexpodelinskii',
            contributions: [
                'Frontend Architecture',
                'API Integration',
                'User Registration',
                'Card page',
                'Cart page',
            ],
        },
        {
            name: 'Alina',
            role: 'Frontend Developer',
            bio: 'The creative engine of the team. She searched for inspiring design, shaped the visual style, curated the team page, and actively managed the task board.',
            photo: alina,
            githubUrl: 'https://github.com/crlinm',
            contributions: [
                'Frontend Architecture',
                'API Integration',
                'User Authentication',
                'User Profile Page',
                'About Page',
            ],
        },
    ];

    return (
        <div className="about">
            <div className="about__inner">
                <div className="about__title section">
                    <h1 className="about__heading">About Our Team</h1>
                    <p className="about__description">
                        We're a passionate team of developers committed to
                        building the best gaming marketplace. Our goal is to
                        connect gamers with their favorite titles through a
                        user-friendly and powerful platform.
                    </p>
                </div>

                <div className="about__rsschool section">
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

                {/* <div className="about__project section">
                    <h2>Project Highlights</h2>
                    <div className="about__project-grid">
                        <div>Modern Tech Stack</div>
                        <div>Collaborative Development</div>
                        <div>User-Centric Design</div>
                    </div>
                </div> */}

                <div className="about__team section">
                    <div>
                        <h2 className="about__team-heading">About the team</h2>
                    </div>
                    <div className="about__team-grid">
                        {teamMembers.map((member, ind) => (
                            <div key={ind} className="about__team-card">
                                <div className="about__team-content">
                                    <img
                                        className="about__team-photo"
                                        src={member.photo}
                                        alt={member.name}
                                    />
                                    <div className="about__team-name">
                                        {member.name}
                                    </div>
                                    <div className="about__team-role">
                                        {member.role}
                                    </div>
                                    <div className="about__team-bio">
                                        {member.bio}
                                    </div>
                                    <div className="about__team-contributions-card">
                                        <h4>Key Contributions:</h4>
                                        <div className="about__team-contributions">
                                            {member.contributions.map(
                                                (contribution, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="about__team-contribution-tag"
                                                    >
                                                        {contribution}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <a
                                        href={member.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="about__team-github"
                                    >
                                        View Github Profile
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
