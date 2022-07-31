import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.css';
import Layout from '@/components/Layout';

export default function EditEvenPage({ evt }) {
    const router = useRouter();

    const [values, setValues] = useState({
        name: evt.name,
        venue: evt.venue,
        address: evt.address,
        date: evt.date,
        time: evt.time,
        description: evt.description,
    });

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // Jugaar Validation
        const hasEmptyFields = Object.values(values).some((element) => element === '');

        if (hasEmptyFields) {
            return toast.error('Please fill in all fields');
        }

        const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: values }),
        });

        if (!res.ok) {
            return toast.error('Something Went Wrong');
        } else {
            const evt = await res.json();

            router.push(`/events/${evt.data.attributes.slug}`);
        }
    };

    const inputChangeHandler = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    return (
        <Layout title='Add Event | Events App'>
            <Link href='/events'>Go Back</Link>
            <h1>Edit Event</h1>
            <ToastContainer />

            <form onSubmit={onSubmitHandler} className={styles.form}>
                <div className={styles.grid}>
                    <div>
                        <label htmlFor='name'>Event Name</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={values.name}
                            onChange={inputChangeHandler}
                        />
                    </div>

                    <div>
                        <label htmlFor='venue'>Venue</label>
                        <input
                            type='text'
                            name='venue'
                            id='venue'
                            value={values.venue}
                            onChange={inputChangeHandler}
                        />
                    </div>
                    <div>
                        <label htmlFor='address'>Address</label>
                        <input
                            type='text'
                            name='address'
                            id='address'
                            value={values.address}
                            onChange={inputChangeHandler}
                        />
                    </div>
                    <div>
                        <label htmlFor='date'>Date</label>
                        <input
                            type='date'
                            name='date'
                            id='date'
                            value={moment(values.date).format('yyyy-MM-DD')}
                            onChange={inputChangeHandler}
                        />
                    </div>
                    <div>
                        <label htmlFor='time'>Time</label>
                        <input
                            type='text'
                            name='time'
                            id='time'
                            value={values.time}
                            onChange={inputChangeHandler}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor='description'>Event Description</label>
                    <textarea
                        type='text'
                        name='description'
                        id='description'
                        value={values.description}
                        onChange={inputChangeHandler}></textarea>
                </div>
                <input type='submit' value='Update Event' className='btn' />
            </form>
        </Layout>
    );
}

export async function getServerSideProps({ params: { id } }) {
    const res = await fetch(`${API_URL}/api/events?filters[id][$eq]=${id}&populate=*`);
    const { data } = await res.json();
    const evt = data.map((evt) => ({ id: evt.id, ...evt.attributes }))[0];
    return {
        props: {
            evt,
        },
    };
}
