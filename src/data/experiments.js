export const PROMPT = 'C:\\Users\\Student>'

export const experiments = [
  { no: '01', title: 'Caesar, Playfair & Hill Cipher', programs: [
    { label: 'a', name: 'Caesar Cipher', file: 'CaesarCipher.java', cls: 'CaesarCipher', lang: 'java',
      aim: 'To encrypt and decrypt the given message by using the Caesar Cipher encryption algorithm.',
      fixes: 'Class renamed to CaesarCipher so it matches the file name (original caused a compile error).',
      code: String.raw`public class CaesarCipher {
    public static String encode(String enc, int offset) {
        offset = offset % 26 + 26;
        StringBuilder encoded = new StringBuilder();
        for (char i : enc.toCharArray()) {
            if (Character.isLetter(i)) {
                char base = Character.isUpperCase(i) ? 'A' : 'a';
                encoded.append((char) (base + (i - base + offset) % 26));
            } else {
                encoded.append(i);
            }
        }
        return encoded.toString();
    }

    public static String decode(String enc, int offset) {
        return encode(enc, 26 - offset);
    }

    public static void main(String[] args) {
        String msg = "Anna University";
        System.out.println("Simulating Caesar Cipher\n-------------------------");
        System.out.println("Input : " + msg);
        System.out.print("Encrypted Message : ");
        System.out.println(CaesarCipher.encode(msg, 3));
        System.out.print("Decrypted Message : ");
        System.out.println(CaesarCipher.decode(CaesarCipher.encode(msg, 3), 3));
    }
}`,
      output: `Simulating Caesar Cipher
-------------------------
Input : Anna University
Encrypted Message : Dqqd Xqlyhuvlwb
Decrypted Message : Anna University` },
    { label: 'b', name: 'Playfair Cipher', file: 'PlayfairCipher.java', cls: 'PlayfairCipher', lang: 'java',
      aim: 'To implement a program to encrypt a plain text and decrypt a cipher text using the Playfair Cipher substitution technique.',
      fixes: 'Class renamed to PlayfairCipher (file/class name match); code cleaned up.',
      code: String.raw`import java.awt.Point;

public class PlayfairCipher {
    private static char[][] charTable;
    private static Point[] positions;

    private static String prepareText(String s, boolean chgJtoI) {
        s = s.toUpperCase().replaceAll("[^A-Z]", "");
        return chgJtoI ? s.replace("J", "I") : s.replace("Q", "");
    }

    private static void createTbl(String key, boolean chgJtoI) {
        charTable = new char[5][5];
        positions = new Point[26];
        String s = prepareText(key + "ABCDEFGHIJKLMNOPQRSTUVWXYZ", chgJtoI);
        for (int i = 0, k = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (positions[c - 'A'] == null) {
                charTable[k / 5][k % 5] = c;
                positions[c - 'A'] = new Point(k % 5, k / 5);
                k++;
            }
        }
    }

    private static String codec(StringBuilder txt, int dir) {
        for (int i = 0; i < txt.length(); i += 2) {
            char a = txt.charAt(i);
            char b = txt.charAt(i + 1);
            int row1 = positions[a - 'A'].y;
            int row2 = positions[b - 'A'].y;
            int col1 = positions[a - 'A'].x;
            int col2 = positions[b - 'A'].x;
            if (row1 == row2) {
                col1 = (col1 + dir) % 5;
                col2 = (col2 + dir) % 5;
            } else if (col1 == col2) {
                row1 = (row1 + dir) % 5;
                row2 = (row2 + dir) % 5;
            } else {
                int tmp = col1;
                col1 = col2;
                col2 = tmp;
            }
            txt.setCharAt(i, charTable[row1][col1]);
            txt.setCharAt(i + 1, charTable[row2][col2]);
        }
        return txt.toString();
    }

    private static String encode(String s) {
        StringBuilder sb = new StringBuilder(s);
        for (int i = 0; i < sb.length(); i += 2) {
            if (i == sb.length() - 1) {
                sb.append('X');
            } else if (sb.charAt(i) == sb.charAt(i + 1)) {
                sb.insert(i + 1, 'X');
            }
        }
        return codec(sb, 1);
    }

    private static String decode(String s) {
        return codec(new StringBuilder(s), 4);
    }

    public static void main(String[] args) {
        String key = "CSE";
        String txt = "Security Lab";
        boolean chgJtoI = true; /* change J to I */
        createTbl(key, chgJtoI);
        String enc = encode(prepareText(txt, chgJtoI));
        System.out.println("Simulating Playfair Cipher\n-----------------------");
        System.out.println("Input Message : " + txt);
        System.out.println("Encrypted Message : " + enc);
        System.out.println("Decrypted Message : " + decode(enc));
    }
}`,
      output: `Simulating Playfair Cipher
-----------------------
Input Message : Security Lab
Encrypted Message : EABPUGYANSEZ
Decrypted Message : SECURITYLABX` },
    { label: 'c', name: 'Hill Cipher', file: 'HillCipher.java', cls: 'HillCipher', lang: 'java',
      aim: 'To implement a program to encrypt and decrypt using the Hill Cipher substitution technique.',
      fixes: 'Class renamed to HillCipher (file/class name match); duplicate code merged into one helper.',
      code: String.raw`public class HillCipher {
    /* 3x3 key matrix for 3 characters at once */
    static int[][] keymat = { { 1, 2, 1 }, { 2, 3, 2 }, { 2, 2, 1 } };
    /* key inverse matrix */
    static int[][] invkeymat = { { -1, 0, 1 }, { 2, -1, 0 }, { -2, 2, -1 } };
    static String key = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    private static String transform(String block, int[][] m) {
        int[] p = new int[3];
        for (int i = 0; i < 3; i++) p[i] = block.charAt(i) - 'A';
        StringBuilder sb = new StringBuilder();
        for (int j = 0; j < 3; j++) {
            int v = 0;
            for (int i = 0; i < 3; i++) v += p[i] * m[i][j];
            sb.append(key.charAt(((v % 26) + 26) % 26));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        String msg = "SecurityLaboratory";
        System.out.println("Simulation of Hill Cipher\n--------------------------");
        System.out.println("Input Message : " + msg);
        msg = msg.toUpperCase().replaceAll("\\s", "");
        int n = msg.length() % 3;
        if (n != 0) {
            for (int i = 1; i <= (3 - n); i++) msg += 'X'; /* padding */
        }
        System.out.println("Padded Message : " + msg);
        String enc = "", dec = "";
        for (int i = 0; i < msg.length(); i += 3) enc += transform(msg.substring(i, i + 3), keymat);
        System.out.println("Encrypted Message : " + enc);
        for (int i = 0; i < enc.length(); i += 3) dec += transform(enc.substring(i, i + 3), invkeymat);
        System.out.println("Decrypted Message : " + dec);
    }
}`,
      output: `Simulation of Hill Cipher
--------------------------
Input Message : SecurityLaboratory
Padded Message : SECURITYLABORATORY
Encrypted Message : EACSDKLCAEFQDUKSXU
Decrypted Message : SECURITYLABORATORY` },
  ] },
  { no: '02', title: 'Rail Fence & Row-Column Transposition', programs: [
    { label: 'a', name: 'Rail Fence Cipher', file: 'RailFenceCipher.java', cls: 'RailFenceCipher', lang: 'java',
      aim: 'To implement a program for encryption and decryption using the rail fence transposition technique.',
      fixes: 'Column count now rounds up (original crashed/lost characters when length was not a multiple of depth); printf replaced with println.',
      code: String.raw`class RailFenceHelper {
    String encode(String msg, int depth) {
        int r = depth;
        int l = msg.length();
        int c = (int) Math.ceil((double) l / depth);
        int k = 0;
        char[][] mat = new char[r][c];
        StringBuilder enc = new StringBuilder();
        for (int i = 0; i < c; i++) {
            for (int j = 0; j < r; j++) {
                mat[j][i] = (k < l) ? msg.charAt(k++) : 'X';
            }
        }
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                enc.append(mat[i][j]);
            }
        }
        return enc.toString();
    }

    String decode(String encmsg, int depth) {
        int r = depth;
        int c = encmsg.length() / depth;
        int k = 0;
        char[][] mat = new char[r][c];
        StringBuilder dec = new StringBuilder();
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                mat[i][j] = encmsg.charAt(k++);
            }
        }
        for (int i = 0; i < c; i++) {
            for (int j = 0; j < r; j++) {
                dec.append(mat[j][i]);
            }
        }
        return dec.toString();
    }
}

public class RailFenceCipher {
    public static void main(String[] args) {
        RailFenceHelper rf = new RailFenceHelper();
        String msg = "Anna University, Chennai";
        int depth = 2;
        String enc = rf.encode(msg, depth);
        String dec = rf.decode(enc, depth);
        System.out.println("Simulating Railfence Cipher\n--------------------------");
        System.out.println("Input Message : " + msg);
        System.out.println("Encrypted Message : " + enc);
        System.out.println("Decrypted Message : " + dec);
    }
}`,
      output: `Simulating Railfence Cipher
--------------------------
Input Message : Anna University, Chennai
Encrypted Message : An nvriy hnanaUiest,Ceni
Decrypted Message : Anna University, Chennai` },
    { label: 'b', name: 'Row and Column Transformation', file: 'TransCipher.java', cls: 'TransCipher', lang: 'java',
      aim: 'To implement a program for encryption and decryption by using the row and column transformation technique.',
      fixes: 'Row count now rounds up (original dropped the last characters, e.g. printed "Sreictuy" instead of the full cipher text).',
      code: String.raw`import java.util.Scanner;

public class TransCipher {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the plain text");
        String pl = sc.nextLine();
        sc.close();

        String s = pl.replace(" ", ""); /* delete spaces */
        System.out.println(s);

        int k = s.length();
        int col = 4;
        int row = (k + col - 1) / col; /* round up */
        char[][] ch = new char[row][col];
        int l = 0;
        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                ch[i][j] = (l < k) ? s.charAt(l++) : '#';
            }
        }

        StringBuilder out = new StringBuilder();
        for (int j = 0; j < col; j++) {
            for (int i = 0; i < row; i++) {
                out.append(ch[i][j]);
            }
        }
        System.out.println(out);
    }
}`,
      output: `Enter the plain text
Security Lab
SecurityLab
SrLeiactbuy#` },
  ] },
  { no: '03', title: 'Data Encryption Standard (DES)', programs: [
    { label: 'a', name: 'DES', file: 'DES.java', cls: 'DES', lang: 'java',
      aim: 'To use the Data Encryption Standard (DES) algorithm for a practical application like user message encryption.',
      fixes: 'Prints encrypted bytes as Base64 (original printed meaningless [B@ addresses); one catch block for all exceptions.',
      note: 'a new random DES key is generated on every run, so the encrypted text changes each time.',
      code: String.raw`import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class DES {
    public static void main(String[] args) {
        try {
            System.out.println("Message Encryption Using DES Algorithm\n-------");
            KeyGenerator keyGen = KeyGenerator.getInstance("DES");
            SecretKey myDesKey = keyGen.generateKey();
            Cipher desCipher = Cipher.getInstance("DES/ECB/PKCS5Padding");

            byte[] text = "Secret Information".getBytes("UTF-8");
            System.out.println("Message : " + new String(text, "UTF-8"));

            desCipher.init(Cipher.ENCRYPT_MODE, myDesKey);
            byte[] textEncrypted = desCipher.doFinal(text);
            System.out.println("Encrypted Message : " + Base64.getEncoder().encodeToString(textEncrypted));

            desCipher.init(Cipher.DECRYPT_MODE, myDesKey);
            byte[] textDecrypted = desCipher.doFinal(textEncrypted);
            System.out.println("Decrypted Message : " + new String(textDecrypted, "UTF-8"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}` } ] },
  { no: '04', title: 'Advanced Encryption Standard (AES)', programs: [
    { label: 'a', name: 'AES', file: 'AES.java', cls: 'AES', lang: 'java',
      aim: 'To use the Advanced Encryption Standard (AES) algorithm for a practical application like URL encryption.',
      fixes: 'Broken string literal ("UTF\\n-8") repaired; both modes use the same transformation name; UTF-8 via StandardCharsets.',
      code: String.raw`import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class AES {
    private static SecretKeySpec secretKey;

    public static void setKey(String myKey) throws Exception {
        byte[] key = myKey.getBytes(StandardCharsets.UTF_8);
        key = MessageDigest.getInstance("SHA-1").digest(key);
        key = Arrays.copyOf(key, 16); /* 128-bit key */
        secretKey = new SecretKeySpec(key, "AES");
    }

    public static String encrypt(String strToEncrypt, String secret) {
        try {
            setKey(secret);
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] data = cipher.doFinal(strToEncrypt.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(data);
        } catch (Exception e) {
            System.out.println("Error while encrypting: " + e);
        }
        return null;
    }

    public static String decrypt(String strToDecrypt, String secret) {
        try {
            setKey(secret);
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] data = cipher.doFinal(Base64.getDecoder().decode(strToDecrypt));
            return new String(data, StandardCharsets.UTF_8);
        } catch (Exception e) {
            System.out.println("Error while decrypting: " + e);
        }
        return null;
    }

    public static void main(String[] args) {
        final String secret = "annaUniversity";
        String originalString = "www.annauniv.edu";
        String encryptedString = AES.encrypt(originalString, secret);
        String decryptedString = AES.decrypt(encryptedString, secret);
        System.out.println("URL Encryption Using AES Algorithm\n-------------");
        System.out.println("Original URL : " + originalString);
        System.out.println("Encrypted URL : " + encryptedString);
        System.out.println("Decrypted URL : " + decryptedString);
    }
}`,
      output: `URL Encryption Using AES Algorithm
-------------
Original URL : www.annauniv.edu
Encrypted URL : vibpFJW6Cvs5Y+L7t4N6YWWe07+JzS1d3CU2h3mEvEg=
Decrypted URL : www.annauniv.edu` } ] },
  { no: '05', title: 'RSA Algorithm (HTML & JavaScript)', programs: [
    { label: 'a', name: 'RSA', file: 'rsa.html', cls: 'rsa', lang: 'html',
      aim: 'To implement the RSA (Rivest-Shamir-Adleman) algorithm using HTML and JavaScript.',
      fixes: 'Invalid </p> tags removed; BigInt modular exponentiation (Math.pow overflowed); undeclared globals fixed; decryption result now shown.',
      code: String.raw`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RSA Encryption</title>
</head>
<body>
<center>
<h1>RSA Algorithm</h1>
<h2>Implemented Using HTML &amp; JavaScript</h2>
<hr>
<table>
<tr><td>Enter First Prime Number:</td><td><input type="number" value="53" id="p"></td></tr>
<tr><td>Enter Second Prime Number:</td><td><input type="number" value="59" id="q"></td></tr>
<tr><td>Enter the Message (number):</td><td><input type="number" value="89" id="msg"></td></tr>
<tr><td>Public Key (n):</td><td id="publickey"></td></tr>
<tr><td>Exponent (e):</td><td id="exponent"></td></tr>
<tr><td>Private Key (d):</td><td id="privatekey"></td></tr>
<tr><td>Cipher Text:</td><td id="ciphertext"></td></tr>
<tr><td>Decrypted Text:</td><td id="plaintext"></td></tr>
<tr><td colspan="2"><button onclick="rsa()">Apply RSA</button></td></tr>
</table>
</center>
<script>
function gcd(a, b) { return b ? gcd(b, a % b) : a; }

function modPow(base, exp, mod) {
  var result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return result;
}

function rsa() {
  var p = BigInt(document.getElementById('p').value);
  var q = BigInt(document.getElementById('q').value);
  var m = BigInt(document.getElementById('msg').value);
  var n = p * q;
  var t = (p - 1n) * (q - 1n);
  if (m >= n) { alert('Message must be smaller than n = ' + n); return; }
  var e = 2n;
  while (e < t && gcd(e, t) !== 1n) e++;
  var d = 1n;
  while ((d * e) % t !== 1n) d++;
  var ct = modPow(m, e, n);
  var pt = modPow(ct, d, n);
  document.getElementById('publickey').innerHTML = n;
  document.getElementById('exponent').innerHTML = e;
  document.getElementById('privatekey').innerHTML = d;
  document.getElementById('ciphertext').innerHTML = ct;
  document.getElementById('plaintext').innerHTML = pt;
}
</script>
</body>
</html>`,
      output: `Enter First Prime Number: 53
Enter Second Prime Number: 59
Enter the Message: 89
Public Key: 3127
Exponent: 3
Private Key: 2011
Cipher Text: 1394` } ] },
  { no: '06', title: 'Diffie-Hellman Key Exchange', programs: [
    { label: 'a', name: 'Diffie-Hellman', file: 'DiffieHellman.java', cls: 'DiffieHellman', lang: 'java',
      aim: 'To implement the Diffie-Hellman key exchange algorithm for a given problem (p = 23, g = 5, a = 4, b = 3).',
      fixes: 'Broken string literal across lines repaired; class made public.',
      code: String.raw`public class DiffieHellman {
    public static void main(String[] args) {
        int p = 23; /* publicly known (prime number) */
        int g = 5;  /* publicly known (primitive root) */
        int x = 4;  /* only Alice knows this secret */
        int y = 3;  /* only Bob knows this secret */

        double aliceSends = (Math.pow(g, x)) % p;
        double bobComputes = (Math.pow(aliceSends, y)) % p;
        double bobSends = (Math.pow(g, y)) % p;
        double aliceComputes = (Math.pow(bobSends, x)) % p;
        double sharedSecret = (Math.pow(g, (x * y))) % p;

        System.out.println("Simulation of Diffie-Hellman key exchange algorithm\n--------------------------------------------------");
        System.out.println("Alice Sends : " + aliceSends);
        System.out.println("Bob Computes : " + bobComputes);
        System.out.println("Bob Sends : " + bobSends);
        System.out.println("Alice Computes : " + aliceComputes);
        System.out.println("Shared Secret : " + sharedSecret);

        /* shared secrets should match and equality is transitive */
        if ((aliceComputes == sharedSecret) && (aliceComputes == bobComputes))
            System.out.println("Success: Shared Secrets Matches! " + sharedSecret);
        else
            System.out.println("Error: Shared Secrets does not Match");
    }
}`,
      output: `Simulation of Diffie-Hellman key exchange algorithm
--------------------------------------------------
Alice Sends : 4.0
Bob Computes : 18.0
Bob Sends : 10.0
Alice Computes : 18.0
Shared Secret : 18.0
Success: Shared Secrets Matches! 18.0` } ] },
  { no: '07', title: 'SHA-1 Algorithm', programs: [
    { label: 'a', name: 'SHA-1', file: 'SHA1Digest.java', cls: 'SHA1Digest', lang: 'java',
      aim: 'To write a program to calculate the 160-bit message digest of an input text using the SHA-1 (Secure Hash Algorithm 1) algorithm in Java.',
      fixes: 'Layout repaired (misplaced brace from the record); hex conversion simplified with String.format.',
      note: 'the digest depends on the exact text you type (including any trailing space).',
      code: String.raw`import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Scanner;

public class SHA1Digest {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter the input text: ");
        String inputText = scanner.nextLine();
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] digest = md.digest(inputText.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : digest) {
                hexString.append(String.format("%02x", b)); /* two-digit hex */
            }

            System.out.println("\n--- Results ---");
            System.out.println("Original Text : " + inputText);
            System.out.println("SHA-1 Digest : " + hexString);
        } catch (NoSuchAlgorithmException e) {
            System.err.println("Error: SHA-1 algorithm not supported on this system.");
        } finally {
            scanner.close();
        }
    }
}` } ] },
  { no: '08', title: 'MD5 Algorithm', programs: [
    { label: 'a', name: 'MD5', file: 'MD5.java', cls: 'MD5', lang: 'java',
      aim: 'To write a Java program to implement the MD5 algorithm.',
      fixes: 'A comment swallowed "public class MD5" (compile error in the original); fixed.',
      code: String.raw`import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

// Java program to calculate MD5 hash value
public class MD5 {
    public static String getMd5(String input) {
        try {
            // Static getInstance method is called with hashing MD5
            MessageDigest md = MessageDigest.getInstance("MD5");

            // digest() calculates the message digest and returns a byte array
            byte[] messageDigest = md.digest(input.getBytes(StandardCharsets.UTF_8));

            // Convert byte array into signum representation
            BigInteger no = new BigInteger(1, messageDigest);

            // Convert message digest into hex value
            String hashtext = no.toString(16);
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }
            return hashtext;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    // Driver code
    public static void main(String[] args) {
        String s = "cryptography";
        System.out.println("Your HashCode Generated by MD5 is: " + getMd5(s));
    }
}`,
      output: `Your HashCode Generated by MD5 is: e0d00b9f337d357c6faa2f8ceae4a60d` } ] },
  { no: '09', title: 'Digital Signature Standard', programs: [
    { label: 'a', name: 'DSS', file: 'CreatingDigitalSignature.java', cls: 'CreatingDigitalSignature', lang: 'java',
      aim: 'To implement the signature scheme - Digital Signature Standard.',
      fixes: '"msg".getByte() did not compile and signed the literal "msg"; now signs the typed text. Signature printed in Base64 (raw bytes printed garbage); verification step added.',
      note: 'DSA signatures are randomised, so the signature differs on every run. Verification should print true.',
      code: String.raw`import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.util.Base64;
import java.util.Scanner;

public class CreatingDigitalSignature {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter some text");
        String msg = sc.nextLine();
        sc.close();

        KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("DSA");
        keyPairGen.initialize(2048);
        KeyPair pair = keyPairGen.generateKeyPair();
        PrivateKey privKey = pair.getPrivate();
        PublicKey pubKey = pair.getPublic();

        byte[] bytes = msg.getBytes("UTF-8");
        Signature sign = Signature.getInstance("SHA256withDSA");
        sign.initSign(privKey);
        sign.update(bytes);
        byte[] signature = sign.sign();
        System.out.println("Digital signature for given text: " + Base64.getEncoder().encodeToString(signature));

        sign.initVerify(pubKey);
        sign.update(bytes);
        System.out.println("Signature verified: " + sign.verify(signature));
    }
}` } ] },
  { no: '10', title: 'Intrusion Detection System (Snort)', programs: [
    { label: 'a', name: 'Snort IDS', file: 'snort-steps.txt', cls: 'snort', lang: 'text',
      aim: 'To demonstrate an Intrusion Detection System (IDS) using the Snort software tool (Content Beyond the Syllabus). Not a Java program: install Snort and WinPcap, then follow the steps below.',
      note: 'Snort prints live alerts to the console and writes them to snort-alerts.ids in C:\\Snort\\log (screenshots in the record).',
      code: String.raw`:: 1. Install Snort (snort.org) and WinPcap; install folder is C:\Snort
::    Copy downloaded rules   -> C:\Snort\rules
::    Copy snort.conf (etc)   -> C:\Snort\etc  (overwrite)

:: 2. Open cmd.exe as Administrator
cd \snort\bin

:: 3. List interfaces, then pick the index of your adapter (example: 3)
snort -W

:: 4. Sniffer mode (-i = interface number)
snort -dev -i 3

:: 5. Edit C:\Snort\etc\snort.conf
var HOME_NET 192.168.1.0/24
var RULE_PATH c:\snort\rules
dynamicengine C:\Snort\lib\snort_dynamicengine\sf_engine.dll
include c:\snort\etc\classification.config
include c:\snort\etc\reference.config
include $RULE_PATH/icmp.rules
include $RULE_PATH/icmp-info.rules
output alert_fast: snort-alerts.ids
:: comment out (#) the white_list / black_list rules and the
:: normalize_* preprocessor lines (normalize_ip4, normalize_tcp,
:: normalize_icmp4, normalize_ip6, normalize_icmp6)
:: change every library path from /usr/local/lib/... to C:\Snort\lib

:: 6. Run Snort in IDS mode
snort -c c:\snort\etc\snort.conf -l c:\snort\log -i 3

:: 7. ASCII logs with console alerts
snort -A console -i3 -c c:\Snort\etc\snort.conf -l c:\Snort\log -K ascii

:: 8. From another computer, scan this machine with ping or Nmap/Zenmap,
::    then check C:\Snort\log\snort-alerts.ids for alerts.`,
      output: `Commencing packet processing (pid=2164)
03/29-23:53:16.033913 [**] [120:3:1] (http_inspect) NO CONTENT-LENGTH OR TRANSFER-ENCODING IN HTTP RESPONSE [**]
[Classification: Unknown Traffic] [Priority: 3] {TCP} 192.168.1.1:80 -> 192.168.1.20:56506` } ] },
]
