(ns balls.config
  (:require [clojure.data.json :refer [read-str]]
            [clojure.java.io :refer [as-file]]))

(def config-file "resources/config/config.json")

(defn- config-file-exists? []
  (.exists (as-file config-file)))

(defn config []
  (when (config-file-exists?)
    (-> config-file
        slurp
        (read-str :key-fn keyword))))