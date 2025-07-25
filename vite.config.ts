    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
      define: {
        // Expose environment variables to client-side code
        // Vite requires explicit definition for process.env variables to be available in browser
        'process.env.REACT_APP_FIREBASE_API_KEY': JSON.stringify(process.env.REACT_APP_FIREBASE_API_KEY),
        'process.env.REACT_APP_FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN),
        'process.env.REACT_APP_FIREBASE_PROJECT_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_PROJECT_ID),
        'process.env.REACT_APP_FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.REACT_APP_FIREBASE_STORAGE_BUCKET),
        'process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID),
        'process.env.REACT_APP_FIREBASE_APP_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_APP_ID),
        'process.env.REACT_APP_GEMINI_API_KEY': JSON.stringify(process.env.REACT_APP_GEMINI_API_KEY),
        // Add any other REACT_APP_ variables your app needs
      },
    });
    ```
    * **Explanation:** The `define` option in Vite configuration allows you to define global constants and inject environment variables into your client-side code during the build. `JSON.stringify` is crucial to ensure they are embedded as string literals.

**Part 2: Reconfirm Firebase Environment Variables in AWS Amplify**

*This step is crucial because if the values are still blank in Amplify, Vite won't have anything to inject.*

1.  Go to your **AWS Amplify Console**.
2.  Navigate to your **ChicksandsTarot** application.
3.  In the left-hand menu, click on **App settings** -> **Environment variables**.
4.  **Click "Manage variables" and double-check that ALL six `REACT_APP_FIREBASE_...` variables have your actual configuration values filled in correctly.** Make sure no values are blank or say `src/firebaseConfig.ts`.
5.  Also, ensure `REACT_APP_GEMINI_API_KEY` is present and correct.
6.  Click **Save** after confirming all values are there.

---

**Part 3: Commit and Push to Deploy**

1.  Save `vite.config.ts` after making the changes in Part 1.
2.  Save `src/firebaseConfig.ts` and `src/App.tsx` (ensure they are the latest versions I've provided in previous turns).
3.  Open your terminal in your project's root directory.
4.  ```bash
    git add .
    git commit -m "Fix: Configured vite.config.ts to expose environment variables correctly for Firebase and Gemini API keys"
    git push origin main # or 'git push origin master'
    ```

After this push, a new build will be triggered on Amplify. This detailed Vite configuration should resolve the `__firebase_config is not defined` error and allow Firebase to initialize correctly on deployment. Please let me know the outco