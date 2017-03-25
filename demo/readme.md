# demo

> Demo of a secure and insecure web page

## Getting started

> Test out the http servers on your laptop (macbook) before transferring to a Raspberry PI

1. Install dependancies with `npm i`
1. Generate new certificates `key.pem` and `cert.pem`
    - Ensure `Common Name` is `localhost` or another domain name E.g. `secure.local`

        ```sh
        $ openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365

        Generating a 2048 bit RSA private key
        ......................+++
        ..........+++
        writing new private key to 'key.pem'
        Enter PEM pass phrase:
        Verifying - Enter PEM pass phrase:
        -----
        You are about to be asked to enter information that will be incorporated
        into your certificate request.
        What you are about to enter is what is called a Distinguished Name or a DN.
        There are quite a few fields but you can leave some blank
        For some fields there will be a default value,
        If you enter '.', the field will be left blank.
        -----
        Country Name (2 letter code) [AU]:SG
        State or Province Name (full name) [Some-State]:Singapore
        Locality Name (eg, city) []:Singapore
        Organization Name (eg, company) [Internet Widgits Pty Ltd]:IoT security demo
        Organizational Unit Name (eg, section) []:
        Common Name (e.g. server FQDN or YOUR name) []:localhost
        Email Address []:sayanee@gmail.com
        ```
1. Add the certificates to KeyChain app
1. Ensure it is `Always Trust`

    ![](img/always-trust.png)
1. Ensure that common Name on certificate generation and domain name is `localhost`

    ![](img/certificate.png)
1. Start the servers on host machine to test

    ```sh
    npm start
    ```
1. Visit <http://localhost:4000> and <https://localhost:5000> in browser

## Transfer code to RaspberryPI

1. Power on the RaspberryPI with Ethernet connected to the same router as host machine
1. Find the IP address of the host machine with Network Preferences
1. Find out the IP address of the RaspberryPI in the same network

    ```sh
    nmap --open -p 22 10.0.1.0-255

    Starting Nmap 7.40 ( https://nmap.org ) at 2017-03-25 15:23 SGT
    Nmap scan report for 10.0.1.7
    Host is up (0.00068s latency).
    PORT   STATE SERVICE
    22/tcp open  ssh
    ```
1. Secure copy the demo code to RaspberryPI

    ```sh
    scp -r . pi@10.0.1.7:/home/pi/demo
    ```
1. SSH into the RaspberryPI with default password `raspberry

    ```sh
    ssh pi@10.0.1.7
    ```
1. Locate the `demo` transferred to the `home` directory

    ```sh
    pi@raspberrypi:~ $ ls -al

    total 32
    drwxr-xr-x 4 pi   pi   4096 Mar 25 07:21 .
    drwxr-xr-x 3 root root 4096 Mar  3 15:27 ..
    -rw------- 1 pi   pi    570 Mar 23 00:35 .bash_history
    -rw-r--r-- 1 pi   pi    220 Mar  3 15:27 .bash_logout
    -rw-r--r-- 1 pi   pi   3608 Mar 22 13:25 .bashrc
    drwxr-xr-x 5 pi   pi   4096 Mar 22 13:27 .nvm
    -rw-r--r-- 1 pi   pi    675 Mar  3 15:27 .profile
    drwxr-xr-x 4 pi   pi   4096 Mar 25 07:21 demo
    ```
