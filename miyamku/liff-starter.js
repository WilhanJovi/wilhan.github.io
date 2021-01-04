var namaLine;
window.onload = function() {
    const useNodeJS = false;   // if you are not using a node server, set this value to false
    const defaultLiffId = "1655537264-qYjMWdwe";   // change the default LIFF value if you are not using a node server
 
    // DO NOT CHANGE THIS
    let myLiffId = "";
    console.log("versi 3");
    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};
 
/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
Kode ini digunakan untuk mengecek kondisi apakah myLiffId bernilai null, apabila null maka LIFF tidak akan di inisialisasi.
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}
 
/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
Pada script ini, LIFF ID yang berhasil di inisialisasi dan sesuai dengan yang ada pada LINE Developers maka Anda bisa menggunakan LIFF API. Apabila tidak maka ia akan menampilkan pesan eror bahwa inisialisasi LIFF gagal.
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
        });
}
 
/**
 * Initialize the app by calling functions handling individual app components
 * Function initializeApp di atas menjelaskan bahwa isLoggedIn akan menampilkan informasi pengguna serta mengecek apakah pengguna membuka aplikasi LIFF pada LINE atau eksternal browser. Apabila pengguna membuka aplikasi LIFF pada LINE maka tombol Login dan Logout tidak akan ditampilkan. Namun apabila melalui eksternal browser, maka tombol login dan logout akan ditampilkan.
 */
function initializeApp() {
    displayLiffData();
    displayIsInClientInfo();
    registerButtonHandlers();
 
    // check if the user is logged in/out, and disable inappropriate button
    if (liff.isLoggedIn()) { 
        document.getElementById('liffLogoutButton').style.visibility= "visible";
        document.getElementById('liffLoginButton').style.visibility= "hidden";
        // document.getElementById('page-main').style.visibility= "hidden";
        liff.getProfile() 
        .then(profile => {
            pictureURL = profile.pictureURL;
            namaLine = profile.displayName;
            document.getElementById("welcome").innerHTML = `halo ${namaLine}, silahkan pilih menu `;
        })
        .catch((err) => {
          console.log('error', err);
        });
        document.getElementById('page-menu').style.visibility= "visible";
        // $('#page-main').hide();
        // $('#page-menu').fadeIn();
        // document.getElementById('liffLoginButton').disabled = true;
    } else { 
        document.getElementById('liffLogoutButton').style.visibility= "hidden";
        document.getElementById('liffLoginButton').style.visibility= "visible";
        // document.getElementById('page-main').style.visibility= "visible";
        document.getElementById("welcome").innerHTML = "Selamat Datang, silahkan login terlebih dahulu!";
        document.getElementById('page-menu').style.visibility= "hidden";
        // $('#page-main').fadeIn();
        // $('#page-menu').hide();
        // document.getElementById('liffLogoutButton').disabled = true;
    }
}
 
/**
* Display data generated by invoking LIFF methods
Pada function displayLiffData berguna untuk menampilkan informasi yang diperoleh dari fungsi liff.isInClient dan isLoggedIn.
*/
function displayLiffData() {
    document.getElementById('isInClient').textContent = liff.isInClient();
    document.getElementById('isLoggedIn').textContent = liff.isLoggedIn();
    console.log("1 displayLiffData" + liff.isLoggedIn());
    console.log("2 displayLiffData" + liff.isInClient());
    console.log("displayLiffData");
}
 
/**
* Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
Function displayIsInClientInfo berperan untuk mengecek apabila pengguna menjalankan aplikasi LIFF dari LINE maka pesan “You are opening the app in the in-app browser of LINE” akan tampil. Namun apabila kita menjalankannya di eksternal browser, maka yang tampil adalah“You are opening the app in an external browser.”
*/
function displayIsInClientInfo() {
    console.log("displayIsInClientInfo " + liff.isInClient());
    if (liff.isInClient()) {
        document.getElementById('liffLoginButton').classList.toggle('hidden');
        document.getElementById('liffLogoutButton').classList.toggle('hidden');
        document.getElementById('isInClientMessage').textContent = 'Kakak lagi buka app ini di browser LINE.';
    } else {
        document.getElementById('isInClientMessage').textContent = 'Kakak lagi buka app ini di browser eksternal.';
        document.getElementById('openWindowButton').style.visibility= "hidden";
    }
}


function registerButtonHandlers() {
    // Kode ini menjelaskan apabila kita klik tombol open window, maka method liff.openWindow() akan dijalankan. Ganti parameter url dengan Endpoint URL aplikasi web yang sudah Anda deploy di Heroku atau lainnya. Sedangkan jika parameter external diisi dengan nilai true maka URL di jalankan pada 
    . Namun, jika diisi dengan nilai false maka URL akan dibuka pada browser LINE.
    document.getElementById('openWindowButton').addEventListener('click', function() {
        liff.openWindow({
            url: 'https://wilhanjovi.github.io/wilhan/miyamku/', // Isi dengan Endpoint URL aplikasi web Anda
            external: true
        });
    });


    // Pada saat pengguna klik tombol close, script akan mengecek kondisi apakah pengguna membuka aplikasi LIFF pada LINE atau eksternal browser. Apabila dijalankan di LINE maka aplikasi akan tertutup. Namun, apabila tidak dijalankan di LINE maka Alert Notification akan tampil.
    document.getElementById('closeWindowButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.closeWindow();
        }
    });


    //Baik login dan logout pada kode ini digunakan apabila kita membuka aplikasi LIFF pada eksternal browser. Apabila kita membuka aplikasi LIFF pada LINE maka fitur tersebut tidak akan dijalankan. Dalam kode diatas dijelaskan bahwa apabila klik tombol login maka secara otomatis akan mengecek apakah pengguna sudah masuk menggunakan akun LINE atau belum. Apabila belum login maka pengguna diharuskan login terlebih dahulu yang kemudian akan di-redirect menuju aplikasi lagi apabila login sukses. Sedangkan untuk dapat menggunakan logout, akan dicek kembali apakah pengguna sudah dalam posisi masuk dengan akun LINE (atau belum). Kalau sudah login sebelumnya, maka pengguna dapat logout akun LINE.
    document.getElementById('liffLoginButton').addEventListener('click', function() {
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    });
 
    document.getElementById('liffLogoutButton').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });


    // apabila pengguna menekan tombol Send Message maka akan memunculkan notifikasi yang menandakan bahwa telah berhasil mengirimkan pesan dan masuk ke dalam obrolan LINE. Skenario berikutnya adalah apabila pengguna setelah membuat,  menyimpan, dan menghapus catatan, sistem akan mengirimkan pesan ke pengguna yang menandakan proses tersebut telah berhasil dilakukan. Untuk mengirimkan pesan ke pengguna kita dapat menggunakan method liff.sendMessages()
    document.getElementById('sendMessageButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.sendMessages([{
                'type': 'text',
                'text': "Kakak telah menggunakan fitur Send Message!"
            }]).then(function() {
                window.alert('Ini adalah pesan dari fitur Send Message');
            }).catch(function(error) {
                window.alert('Error sending message: ' + error);
            });
        }
    });

    
}

function ExampleSendMessage(_text){ 
    console.log("iya kesini");
    if (!liff.isInClient()) {
        sendAlertIfNotInClient();
    } else {
        liff.sendMessages([{
            'type': 'text',
            'text': `Terimakasih ${namaLine}, sudah memesan `+_text
        }]).then(function() {
            window.alert('Ini adalah pesan dari fitur Send Message');
        }).catch(function(error) {
            window.alert('Error sending message: ' + error);
        });
    }
}

// Function sendAlertIfNotInClient berguna untuk menampilkan pesan di layar yang menandakan aplikasi LIFF tidak mendukung eksternal browser. Sedangkan function toggleElement digunakan untuk beralih dari satu elemen ke elemen yang lainnya.
function sendAlertIfNotInClient() {
    alert('Fungsi ini hanya bisa kakak gunakan dengan menggunakan LINE di smartphone');
}

/**
* Toggle specified element
* @param {string} elementId The ID of the selected element
*/
function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = 'none';
    } else {
        elem.style.display = 'block';
    }
}



