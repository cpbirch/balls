(ns balls.config
  (:require [clojure.data.json :refer [read-str]]))

(defn config []
  (-> "resources/config/config.json"
      slurp
      (read-str :key-fn keyword)))