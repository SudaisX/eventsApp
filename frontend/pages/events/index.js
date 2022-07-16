import { API_URL } from '@/config/index';
import Layout from '@/components/Layout';
import EventItem from '@/components/EventItem';

const EventsPage = ({ events }) => {
    return (
        <Layout>
            <h1>Events</h1>
            {events.length === 0 ? (
                <h3>No Events to Show..</h3>
            ) : (
                events.map((evt) => <EventItem key={evt.id} evt={evt} />)
            )}
        </Layout>
    );
};

export default EventsPage;

export async function getStaticProps() {
    const res = await fetch(`${API_URL}/api/events?sort=date:asc&populate=*`);
    const { data } = await res.json();
    const events = data.map((evt) => ({ id: evt.id, ...evt.attributes }));
    return {
        props: { events },
        revalidate: 1,
    };
}
