import React from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const events = [
    {
        date: 'March 15',
        title: 'Announce the Launch of FYC',
        description: ''
    },
    {
        date: 'April 2',
        title: 'Presale',
        description: ''
    },
    {
        date: 'April 5',
        title: 'FYC Discord Launch',
        description: ''
    },
    {
        date: 'Spring 2022',
        title: 'Public launch of FYC 2750 tokens',
        description: ''
    },
    {
        date: 'Spring 2022',
        title: 'Buy land in the Metaverse',
        description: ''
    },
    {
        date: 'Summer 2022',
        title: 'Launch Charter Operations',
        description: 'Strategic partners starting in Miami and  Ibiza and roll-out in other locations as per member support.'
    },
    {
        date: 'Summer 2022',
        title: 'Miami Private boat party',
        description: 'Miami private boat party exclusively for and complimentary to members. Details to follow soon.'
    },
    {
        date: 'Fall 2022',
        title: 'First of Fathom Yacht Club owned vessels will go into charter.',
        description: ''
    },
    {
        date: 'October 2022',
        title: 'Members only events in conjunction with Ft Lauderdale International Boat Show',
        description: ''
    },
    {
        date: '2023 and Beyond',
        title: 'Continued Growth',
        description: 'The club will continue and grow both the number and scale of activities, partnerships and physical assets with acquisitions of additional yachts and a possible private island or similar facility for members exclusive use.'
    }
];

export default function Roadmap() {
    return (
        <div className="roadmap-container">
            <VerticalTimeline
             lineColor={ '#000' }
             animate={ true }
            >
                {
                    events.map((item, index) => {
                        return (
                            <VerticalTimelineElement
                                className="vertical-timeline-element--work"
                                contentStyle={{ background: '#eee', color: '#000' }}
                                contentArrowStyle={{ borderRight: '7px solid  #eee' }}
                                iconStyle={{ background: '#001ed4', color: '#fff', width: '30px', height: '30px', marginLeft: '-15px' }}
                                key={index}
                            >
                                <div>
                                    <h4 className="text-xxl font-light font-abel">{item.date}: {item.title}</h4>
                                    { item.description && <p className="text-lg text-copy-darker font-medium font-robo mt-2">{item.description}</p> }
                                </div>
                            </VerticalTimelineElement>
                        )
                    })
                }
            </VerticalTimeline>
        </div>
    );
};