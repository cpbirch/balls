(ns balls.config
  (:require [clojure.data.json :refer [read-str]]
            [clojure.java.io :refer [as-file]]
            [balls.sounds :as sounds]))

(def config-file "resources/config/config.json")
(def default-breaking-build-sound (sounds/normalize-name "wario_ah_hahaha_wonderful.wav"));
(def default-success-from-broken-build-sound (sounds/normalize-name "mario_woo_hoo.wav"));

(defn- config-file-exists? []
  (.exists (as-file config-file)))

(defn config []
  (when (config-file-exists?)
    (-> config-file
        slurp
        (read-str :key-fn keyword))))