import { API_URL } from '@/config/index';
import Layout from '@/components/Layout';
import EventItem from '@/components/EventItem';
import Link from 'next/link';

const HomePage = ({ events }) => {
    return (
        <Layout>
            <h1>Upcoming Events</h1>
            {events.length === 0 ? (
                <h3>No Events to Show..</h3>
            ) : (
                <>
                    {events.map((evt) => (
                        <EventItem key={evt.id} evt={evt} />
                    ))}

                    <Link href='/events'>
                        <a className='btn-secondary'>View All Events</a>
                    </Link>
                </>
            )}
        </Layout>
    );
};

export default HomePage;

export async function getStaticProps() {
    const res = await fetch(
        `${API_URL}/api/events?sort=date:asc&pagination[pageSize]=3&populate=*`
    );
    const { data } = await res.json();
    const events = data.map((evt) => ({ id: evt.id, ...evt.attributes }));
    return {
        props: { events },
        revalidate: 1,
    };
}
