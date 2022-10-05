import { CONFIG_CHANGE } from "./configActionTypes"

const initialState =
    { "images": { "siplah": "https://siplah.eurekabookhouse.co.id/assets/front/images/icons/siplah-logo2.png", "bos": "https://siplah.eurekabookhouse.co.id/assets/front/images/icons/logo-bos.png", "kemendikbudGif": "https://siplah.eurekabookhouse.co.id/assets/image/kemdikbud_anim.gif", "menkominfo": "https://siplah.eurekabookhouse.co.id/assets/front/images/icons/kominfo-logo.png", "banner": ["https://siplah.eurekabookhouse.co.id/assets/front/images/banner/larangan-bos.png"], "payment": ["https://siplah.eurekabookhouse.co.id/assets/front/images/icons/briva_logo.png"], "shipping": ["https://siplah.eurekabookhouse.co.id/assets/front/images/icons/siplah-logo2.png"] }, "section": { "profitUsing": { "title": "Keuntungan Menggunakan SIPLah Eureka Bookhouse", "items": [{ "icon": "https://siplah.eurekabookhouse.co.id/assets/front/images/banner-index/icon/027-shipment.png", "title": "Produk Bervariasi", "text": "Pilihan produk dari berbagai penyedia se-Indonesia" }, { "icon": "https://siplah.eurekabookhouse.co.id/assets/front/images/banner-index/icon/004-dollars.png", "title": "Pembayaran Fleksibel", "text": "Tentukan sendiri kemampuan tempo pembayaran saat membuat pesanan" }, { "icon": "https://siplah.eurekabookhouse.co.id/assets/front/images/banner-index/icon/006-wallet.png", "title": "Cashless", "text": "Tanpa ribet membawa uang tunai" }, { "icon": "https://siplah.eurekabookhouse.co.id/assets/front/images/banner-index/icon/039-security-shield.png", "title": "Aman", "text": "Pembayaran dengan perantara pihak SIPlah" }, { "icon": "https://siplah.eurekabookhouse.co.id/assets/front/images/banner-index/icon/044-buy-button.png", "title": "Mudah", "text": "Lakukan pembelian di ujung jari anda" }, { "icon": "https://siplah.eurekabookhouse.co.id/assets/front/images/banner-index/icon/014-discount-label.png", "title": "Nego", "text": "Dapatkan harga terbaik untuk pembelian anda" }] }, "aboutSiplah": { "title": "Sekilas SIPLah", "items": [{ "title": "Ringkasan", "text": "Sistem Informasi Pengadaan Sekolah (SIPLah) adalah sistem elektronik yang dapat digunakan oleh sekolah untuk melaksanakan proses PBJ secara daring yang dananya bersumber dari dana BOS. SIPLah dirancang untuk memanfaatkan Sistem Pasar Daring (Online Marketplace) yang dioperasikan oleh pihak ketiga. Sistem pasar daring yang dapat dikategorikan sebagai SIPLah harus memiliki fitur tertentu dan memenuhi kebutuhan Kementerian Pendidikan dan Kebudayaan." }, { "title": "Fitur", "text": "SIPLah harus memiliki fitur utama yang dapat memfasilitasi sekolah untuk merealisasikan rencana kerja anggaran sekolah, memperoleh informasi mengenai penyedia barang dan jasa, informasi mengenai barang dan jasa yang akan dibeli, melakukan perbandingan harga barang dan jasa, melakukan pemesanan barang dan jasa, melakukan pemantauan pemenuhan pesanan, melaksanakan pembayaran non tunai, dan mengelola dokumentasi proses serta bukti transaksi PBJ. SIPLah harus dapat menjadi media interaksi daring antara sekolah sebagai pembeli dengan penyedia barang dan jasa dan sebagai penjual. SIPLah juga harus dapat menjadi alat bantu supervisi proses PBJ oleh Kepala Sekolah dan/atau Bendahara Sekolah. SIPLah juga harus dapat memenuhi kebutuhan Kementerian Pendidikan dan Kebudayaan dalam melakukan pengawasan atas proses pengadaan barang dan jasa sekolah serta realisasi penggunaan dana BOS sesuai dengan ketentuan yang berlaku." }, { "title": "Tujuan", "text": "Sistem berbasis teknologi informasi dan komunikasi dengan konsep sistem elektronik BOS bertujuan mewujudkan tata kelola keuangan yang transparan dan efektif khususnya dalam pengelolaan dana BOS. Didalamnya akan terdiri dari beberapa aplikasi berbasis TIK untuk melakukan tata kelola, mulai dari perencanaan, realisasi dan pelaporan dana BOS. Dengan adanya SIPLah diharapkan tata kelolah dana BOS dapat lebih terdokumentasi dengan baik, lebih transpadan dan akuntabel. Pengembangan sistem elektronik BOS juga juga untuk mendukung kebijakan pengaplikasian proses transaksi non tunai (cashless) dalam penyaluran dan pemanfaatan Dana BOS." }] } } }





const addConfig = (state, config) => {
    if (JSON.stringify(state) !== JSON.stringify(config)) {
        state = config
    }
    return state

}


export default function configReducer(state = initialState, action) {
    if (action.type === CONFIG_CHANGE) {
        return addConfig(state, action.payload)
    }
    return state
}