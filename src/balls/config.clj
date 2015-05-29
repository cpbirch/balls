(ns balls.config
	(:require [clojure.data.json :refer [read-str]]
						[clojure.java.io :refer [as-file]]
						[clojure.string :as clj-str]
						[balls.media :as media]))

(def config-file "resources/config/config.json")
(def default-breaking-build-sound (media/normalize-name "wario_ah_hahaha_wonderful.wav")) ;
(def default-success-from-broken-build-sound (media/normalize-name "mario_woo_hoo.wav")) ;

(def username-file "resources/config/username")
(def password-file "resources/config/password")

(def ^:private -config (atom {}))
(def ^:private username (atom nil))
(def ^:private password (atom nil))

(defn- config-attr [attr]
	(attr @-config))

(defn- file-exists? [file]
	(.exists (as-file file)))

(defn- reset-config [new-val]
	(reset! -config new-val))

(defn read-credentials []
	(when (and (file-exists? username-file) (file-exists? password-file))
		(do
			(->> username-file slurp clj-str/trim (reset! username))
			(->> password-file slurp clj-str/trim (reset! password)))))

(defn credentials []
	(when-not (or (clj-str/blank? @username) (clj-str/blank? @password))
		[@username @password]))

(defn config-from-file []
	(read-credentials)
	(when (file-exists? config-file)
		(-> config-file
				slurp
				(read-str :key-fn keyword)
				reset-config)))

(defn- override [attr-key params-key-to-override params]
	(if-let [attr-val (config-attr attr-key)]
		(assoc params params-key-to-override attr-val)
		params))

(def override-url (partial override :cctray-url :url))
(def override-red-alert-threshold (partial override :red-alert-threshold :red-alert-threshold))
(def override-glitch-effect-threshold (partial override :glitch-effect-threshold :glitch-effect-threshold))

(defn override-config-data [params]
	(-> params
			override-url
			override-red-alert-threshold
			override-glitch-effect-threshold))