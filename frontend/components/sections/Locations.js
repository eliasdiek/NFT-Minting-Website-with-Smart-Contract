import { Fragment, useState, useEffect } from 'react';
import Image from 'next/image';
import { Transition } from '@headlessui/react';

const locations = [
    {
        name: 'Miami',
        description: 'Miami is in the race to become the “crypto” capital of the United States and offers all year Sunshine. As such, Miami is home to Fathom Yacht Club. Yachting experiences include the infamous Bakers haul–over, government cut, Star Island, and the picturesque Stiltsville. When you combine Miami’s epic nightlife with a see-and-be-seen attitude and international culture, we are sure Miami will be on the top of everyone’s list to visit. Our fleet will include the full range from power to prestige yachts available for one day and multi-day use.',
        image: 'fathom-yacht-charters-miami-1.jpeg'
    },
    {
        name: 'Ibiza',
        description: 'Ibiza is one of the Balearic Islands, an archipelago of Spain in the Mediterranean Sea. It’s well known for the lively nightlife in Ibiza Town and Sant Antoni, where major European nightclubs have summer outposts. Ibiza will serve as the home base for Fathom Yacht Club’s European operations. Ibiza offers a longer yachting season and a host of yachting services that make it an ideal choice to run operations out of and offer unforgettable experiences.  Boats will be operated seasonally and include the full range of boats from power to prestige for both one day and multi-day use.',
        image: 'ibiza-yacht-charter-1.jpeg'
    },
    {
        name: 'Bahamas',
        description: 'Cruising the Exumas is ideal for those that enjoy solitude, nature, unspoiled beauty and quaint, low–key beach settlements. You can also experience some of the most amazing diving, snorkeling and fishing here in the Out Islands of the Bahamas. If you love animals, you can swim with nurse sharks at Compass Cay, swim with pigs at Big Major Cay and feed the iguanas at Allen Cays. It’s the perfect tropical destination for a yacht charter. Boats will be operated seasonally and likely include the full range of boats from power to prestige.',
        image: 'bahamas-charter-fathom.jpeg'
    },
    {
        name: 'Southern California',
        description: 'Enjoy social and boating activities in Southern California.  California is one of the most popular destinations in North America with over 800 miles of beautiful beaches and rugged shoreline.The best time of year for a California yacht charter is from May to November, however, Southern California’s season can be enjoyed all year round. ',
        image: 'ibiza-yacht-charter-1.jpeg'
    },
    {
        name: 'Future Locations',
        description: 'Members will vote on which locations they would like us to expand to in the future.',
        image: '',
        items: [
            {
                name: 'Carribean',
                image: 'st-barths-anguilla-yacht-charter.jpeg'
            },
            {
                name: 'Cabo San Lucas',
                image: 'cabo-san-lucas-boat-charters-1.jpeg'
            },
            {
                name: 'Greece',
                image: 'greece-yacht-charter-fathom-yacht-club.jpeg'
            },
            {
                name: 'Croatia',
                image: 'croatia-yacht-charters.jpeg'
            },
            {
                name: 'Italy',
                image: 'italy-yacht-charter.jpeg'
            },
            {
                name: 'Singapore',
                image: 'singapore-yachts.jpeg'
            }
        ]
    }
];

export default function Locations() {
    const [openMenu, setOpenMenu] = useState(false);

    function toggleMenu() {
        setOpenMenu(!openMenu);
    }

    const scrollTo = (e, id) => {
        e.preventDefault();

        try {
            const width = window.innerWidth;
            const adder = 240;

            if (width < 768) {
                adder = 300;
                setOpenMenu(false);
            }

            const elem = document.getElementById(id);
            const height = elem.offsetTop + adder;
            console.log('[height]', height);
            window.scrollTo(0, height);
        }
        catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const width = window.innerWidth;

        if (width > 768) setOpenMenu(true);
    }, []);

    return (
        <div className="w-full py-8 relative">
            <h2 className="font-light text-xxl text-center mt-4 mb-16 sm:mb-4 px-4">Miami and Ibiza will be the first locations for yacht charters.</h2>

            <div className="absolute top-36 w-full z-20 flex items-center justify-center sm:hidden">
                <button onClick={() => toggleMenu()}>
                    <div className="space-y-1">
                        <div className="w-5 h-0.5 bg-primary"></div>
                        <div className="w-5 h-0.5 bg-primary"></div>
                        <div className="w-5 h-0.5 bg-primary"></div>
                    </div>
                </button>
            </div>

            <Transition
                enter="transform transition-all sm:transition-none ease-in-out duration-500 sm:duration-0"
                enterFrom="max-h-0 overflow-hidden"
                enterTo="max-h-screen overflow-hidden"
                leave="transform transition-all sm:transition-none ease-in-out duration-500 sm:duration-0"
                leaveFrom="max-h-screen overflow-hidden"
                leaveTo="max-h-0 overflow-hidden"
                show={openMenu}
                as={Fragment}
            >
                <div className='absolute sm:relative top-30 sm:top-0 z-10 sm:p-0 sm:mb-6 w-full sm:w-full flex justify-center sm:shadow-none'>
                    <ul className="block sm:flex mx-10 items-center px-2 pt-4 sm:pt-0 pb-4 sm:pb-0 text-base font-bold shadow-md sm:shadow-none bg-white border-t-3 border-primary sm:border-none">
                    {
                        locations.map(location => {
                            return (
                                <li key={location.name} className="pr-6 px-4 py-2 border-b sm:border-none border-gray-100 text-sm sm:text-base">
                                    <a href={`#${location.name.toLocaleLowerCase()}`} className="text-xl text-primary font-muli font-medium" onClick={e => scrollTo(e, location.name.toLocaleLowerCase())}>{ location.name }</a>
                                </li>
                            )
                        })
                    }
                    </ul>
                </div>
            </Transition>

            {
                locations.slice(0, locations.length - 1).map((location, index) => {
                    return (
                        <div className={`flex flex-col ${ index % 2 == 1 ? 'sm:flex-row-reverse' : 'sm:flex-row' }`} id={location.name.toLocaleLowerCase()} key={index}>
                            <div className="w-full sm:w-1/2 image-block">
                                <Image src={`/images/${location.image}`} className="w-full h-full block" width={1000} height={565} />
                            </div>
                            <div className="w-full sm:w-1/2 p-8">
                                <h2 className="mb-2 font-muli text-3xxl font-semibold text-center text-copy-dark">{ location.name }</h2>
                                <p className="font-light text-llg text-copy-secondary">{ location.description }</p>
                            </div>
                        </div>
                    )
                })
            }

            <div className="container pt-16 pb-4 sm:pb-8" id={locations[locations.length - 1].name.toLocaleLowerCase()}>
                <h2 className="text-primary text-5xl font-light text-center py-4">{ locations[locations.length - 1].name }</h2>
                <p className="font-light text-xl py-2 text-copy-secondary text-center">{ locations[locations.length - 1].description }</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                    {
                        locations[locations.length - 1].items.map((item, index) => {
                            return (
                                <div className="relative mt-8" key={index}>
                                    <div className="image-block">
                                        <Image src={`/images/${item.image}`} className="w-full h-full block" width={400} height={220} />
                                    </div>
                                    <div className="absolute bg-background-overlay top-0 z-10 w-full h-full flex items-center justify-center">
                                        <h4 className="text-3xl font-medium text-white copy-shadow-sm">{ item.name }</h4>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
};