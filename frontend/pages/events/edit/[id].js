import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { FaImage } from 'react-icons/fa';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.css';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';

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
    const [imagePreview, setImagePreview] = useState(
        evt.image ? evt.image.data.attributes.formats.thumbnail.url : null
    );
    const [showModal, setShowModal] = useState(false);

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

            <h2>Event Image</h2>
            <div style={{ position: 'relative', height: '250px' }}>
                {imagePreview ? (
                    <Image
                        src={
                            evt.image &&
                            evt.image.data &&
                            evt.image.data.attributes.formats.medium.url
                        }
                        layout='fill'
                        objectFit='contain'
                        alt='img'
                    />
                ) : (
                    <div>
                        <h1>No image uploaded</h1>
                    </div>
                )}
            </div>

            <div style={{ textAlign: 'center' }}>
                <button
                    className='btn-secondary'
                    style={{ marginTop: '10px' }}
                    onClick={() => setShowModal(true)}>
                    <FaImage /> Set Image
                </button>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                Image Upload
            </Modal>
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
