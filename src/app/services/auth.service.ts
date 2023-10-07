import { Injectable, inject } from '@angular/core';
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, addDoc, collection, serverTimestamp } from '@angular/fire/firestore';
import { PushNotifications } from '@capacitor/push-notifications';
import { Toast } from '@capacitor/toast';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(Auth);
  firestore = inject(Firestore);

  addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  }

  registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }

  constructor() {
    this.addListeners();
  }

  async signup(email: string, password: string): Promise<UserCredential | void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential;
    } catch (err) {
      if ((err as any).code === 'auth/email-already-in-use') {
        await Toast.show({
          text: 'Email already exists',
          duration: 'long'
        });
      }
      return;
    }
  }

  async createUser(fullname: string, username: string, email: string) {
    // console.log(this.auth.currentUser);
    try {
      const userRef = collection(this.firestore, 'users');
      const user = await addDoc(userRef, {
        fullname,
        username,
        email,
        uid: this.auth.currentUser?.uid,
        createdAt: serverTimestamp()
      });
      return user;
    } catch (err) {
      console.error(err);
      return '';
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.registerNotifications();
      return userCredential;
    } catch (err) {
      console.log((err as any).code);
      if ((err as any).code === 'auth/invalid-login-credentials') {
        await Toast.show({
          text: 'Invalid email or password',
          duration: 'long'
        });
      }
      return '';
    }
  }

  async logout() {
    await signOut(this.auth);
  }
}
