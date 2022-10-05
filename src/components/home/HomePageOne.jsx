// react
import React, { useEffect, useState, lazy } from "react";

import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

// third-party
import { Helmet } from "react-helmet-async";

// application
import store from "../../api/store";

// data stubs
import theme from "../../data/theme";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";

const BlockStores = lazy(() => import("../blocks/BlockStores"));
const BlockLoader = lazy(() => import("../blocks/BlockLoader"));
const BlockFeatures = lazy(() => import("../blocks/BlockFeatures"));
const BlockSlideShow = lazy(() => import("../blocks/BlockSlideShow"));

const HomePageOne = React.memo((props) => {
    const { customer, openNotif } = props
    const [isOpenModal, setIsOpenModal] = useState(true);
    const [dataStores, setDataStores] = useState([]);
    const [isLoadingStore, setIsLoadingStore] = useState(true);
    const { section } = props.config;
    const { token } = customer

    // fetch store
    useEffect(() => {
        setIsLoadingStore(true);
        store.getStores({ page: 1, limit: 11, front: 1 }, {}, null, token).then((res) => {
            const { data } = res;

            setIsLoadingStore(false);
            setDataStores(data.items);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const doHandleOpen = () => {
        setIsOpenModal(!isOpenModal);
    };

    if (isLoadingStore) {
        return <BlockLoader />;
    }
    const { profitUsing, aboutSiplah } = section;
    const slideImages = [
        {
          url: 'images/banner.jpg',
          caption: 'Slide 1'
        },
        {
          url: 'images/banner-2.jpg',
          caption: 'Slide 2'
        } 
      ];

    return (
        <>
            <Helmet>
                <title>{`${theme.name} | Belanja keperluan sekolah praktis dan mudah`}</title>
            </Helmet>

            {!openNotif &&
                <Modal isOpen={isOpenModal} toggle={doHandleOpen} centered size="xl">
                    <ModalBody
                        style={{
                            // height: "500px",
                            overflowY: "auto",
                            overflowX: "hidden",
                        }}
                    >
                        <h4 className="text-center mb-3 mt-2">PERHATIAN</h4>
                        <div className="d-block  text-center font-weight-bold">
                            Mulai 01 Juli 2022, sesuai PMK no. 58 tahun 2022,<br /> Satuan Pendidikan dimohon melakukan pembayaran dengan mengacu kepada proforma/invoice. <br/> Invoice ini berlaku sebagai dokumen yang dipersamakan dengan bukti pemotongan PPh Pasal 22 dan dokumen tertentu yang kedudukannya dipersamakan dengan Faktur Pajak .
                        </div>
                        <hr />
                        <ol>
                            <li>
                                Sesuai amanat Permendikbud Nomor 14 Tahun 2020 Tentang Pedoman PBJ oleh Satuan Pendidikan,
                                Satuan Pendidikan wajib melakukan belanja melalui SIPLah untuk seluruh sumber dana.
                            </li>
                            <li>
                                Transaksi pembelanjaan melalui SIPLah tidak dibatasi besaran nilai. Perbedaanya ada pada
                                tahapan belanja.
                            </li>
                            <li>
                                User Dapodik yang dapat mengakses SIPLah adalah user Kepala Satuan Pendidikan atau pendidik
                                dan/atau tenaga kependidikan yang ditunjuk oleh Kepala Satuan Pendidikan, baik secara
                                perorangan atau kelompok kerja untuk melaksanakan PBJ Satuan Pendidikan.
                            </li>
                            <li>
                                SIPLah memfasilitasi pembelian buku dengan SK kelayakan yang diterbitkan setelah tahun 2015.
                            </li>
                            <li>
                                Jika Penerbit ingin melakukan pendaftaran buku dengan SK kelayakan yang diterbitkan sebelum
                                tahun 2015 dan SK dari Kementerian Agama dan/atau Pemerintah Daerah atau buku buku SMK, maka
                                penerbit yang bersangkutan harus bersurat ke Pusat Kurikulum dan Perbukuan Kemendikbud
                                melalui email buku@kemdikbud.go.id dan dapat menghubungi melalui nomor (021) - 3806229.
                            </li>
                            <li>
                                Pusat Kurikulum dan Perbukuan Kemendikbud dalam waktu selambat-lambatnya 3 hari akan memberi
                                tanggapan akan surat tersebut.
                            </li>
                            <li>
                                Prosedur yang dapat dilakukan jika Satuan Pendidikan terkendala login:
                                <ul>
                                    <li>Silahkan hubungi operator DAPODIK Dinas Pendidikan. </li>
                                    <li
                                        style={{
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        Helpdesk DAPODIK yang ditunjuk ke masing-masing sekolah. (Buka{" "}
                                        <a href="https://dapo.kemdikbud.go.id/" target="_blank" rel="noopener noreferrer">
                                            https://dapo.kemdikbud.go.id/
                                        </a>{" "}
                                        login menggunakan Akun Operator).
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Satuan Pendidikan wajib memeriksa kesesuaian barang/jasa yang akan dibeli dengan barang/jasa
                                yang diterima oleh Satuan Pendidikan. Jika ada ketidaksesuaian, Satuan Pendidikan tidak
                                boleh mengisi dan mengunggah BAST.
                            </li>
                            <li>Satuan Pendidikan wajib melakukan pembayaran setelah mengisi dan mengunggah BAST.</li>
                            <li>
                                Bagi Satuan Pendidikan yang terkendala dalam proses transaksi dan bagi Penyedia yang
                                terkendala teknis dalam proses registrasi, verifikasi, dan transaksi dapat menghubungi Mitra
                                Pasar Daring SIPLah terkait (sesuai dengan masing-masing mitra).
                            </li>
                        </ol>
                    </ModalBody>
                    <ModalFooter>
                        <button onClick={doHandleOpen} className="btn btn-lg btn-primary">
                            MENGERTI
                        </button>
                    </ModalFooter>
                </Modal>
            }


            <div className="container mt-3"> 
            <Carousel showArrows={true}  showThumbs={false} autoPlay={true} interval={4000} infiniteLoop={true}>
            {slideImages.map((slideImage, index)=> (
                <div>
                <img src= {slideImage.url} /> 
                </div>
            ))}
            </Carousel>

            </div>
             {/* <BlockSlideShow /> */}

            <BlockStores
                viewMore
                linkViewMore="/store"
                title="Toko Penyedia Terdaftar"
                layout="list-sm"
                stores={dataStores}
                isLoadingStore={isLoadingStore}
            />

            <BlockFeatures layout="classic" profitUsing={profitUsing} />

            <div className="">
                <div className="card bg-danger text-white text-justify border-0" style={{ borderRadius: '0' }}>
                    <div className="card-body">
                        <h3 className="block-header__title text-center mb-3">{aboutSiplah.title}</h3>
                        {aboutSiplah.items.map((item) => (
                            <div className="my-3">
                                <h6>{item.title}</h6>
                                <p>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
});

const mapStateToProps = (state) => ({
    config: state.config,
    customer: state.customer,
    openNotif: state.openNotif
});

// const mapDispatchToProps = {
//     configChange: configChange,
// };

export default connect(mapStateToProps, null)(HomePageOne);
