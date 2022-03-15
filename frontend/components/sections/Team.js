import Image from 'next/image';

const members = [
    {
        name: 'Jessica Hunt',
        image: 'jhunt.png',
        role: 'Co-Founder / CMO',
        bio: 'Jessica has over 15 years of experience in the hospitality and marketing industry.  She graduated with a Master’s degree in Hospitality Management. Jessica has experience as a Chief Marketing Officer building marketing strategies for Blockchain companies.  Jessica will be overseeing digital marketing and the virtual aspects of the club. '
    },
    {
        name: 'Jonathan Sands',
        image: 'jsands.png',
        role: 'Co-Founder / CEO',
        bio: 'Jonathan has been working in the Marine and Yachting Industry for over 25 years. Jonathan has worked in various roles in the yachting industry relating to yacht purchases, maintenance, and yacht and charter operation management. Jonathan will be setting the direction of the club and overseeing the acquisition of yachts, deployment into charter, and will be the director of all charter operations. '
    },
    {
        name: 'Darragh Lawton',
        image: 'dlawton.png',
        role: 'CBDO - Europe',
        bio: 'Darragh Lawton has more than 20 years of experience in technology & finance, from software & e-commerce to VC & PE. Darragh is President of Green Bull Capital, a Madrid based VC & PE firm, since 2012. He specializes in disruptive software & IoT companies and has been involved with several blockchain startups.'
    },
    {
        name: 'Danny Zeenberg',
        image: 'dzeenberg.png',
        role: 'COO',
        bio: 'Danny has been in the hospitality industry for 20+ years.  Danny will responsible for the day-to-day operations of the organization more and more specifically will be responsible for events and activities within the organization. He has a history of managing several multimillion-dollar facilities and is currently the Food and Beverage director.'
    }
]

export default function Team() {
    return (
        <div className="container-lg py-6">
            <h3 className="text-4xxl font-light text-primary text-center py-4 mb-8">Meet The FYC Team</h3>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-4 gap-8">
                {
                    members.map((member, index) => {
                        return (
                            <div className="p-2" key={index}>
                                <div className="image-block w-full flex items-center justify-center text-center mb-4">
                                    <Image src={`/images/${member.image}`} className="block" layout="fixed" width={180} height={180} alt={member.name} />
                                </div>
                                <h4 className="font-pop font-medium text-center text-copy-dark mb-4">{ member.name }</h4>
                                <p className="font-light text-gray-500 mb-2 text-center">{ member.role }</p>
                                <p className="font-light text-copy-darker mb-4 text-center">{ member.bio }</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};