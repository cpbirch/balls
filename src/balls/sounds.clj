(ns balls.sounds
  (:require [clojure.data.json :refer [read-str]]
            [clojure.java.io :refer [as-file file]]
            [clojure.string :as string]))

(def sounds-dir "resources/public/sounds")

(def web-path (partial str "/sounds/"))

(defn- list-files [dir]
  (-> dir file .listFiles))

(defn- get-names [files]
  (map #(.getName %) files))

(defn- normalize [filename]
  (-> filename
      (string/split #"\.")
      first
      (string/replace #"_", " ")
      (string/replace #"\W", " ")
      (string/replace #"\s+", " ")))

(defn- normalized-map [filenames]
  (->> filenames
       (map (juxt normalize web-path))
       (into {})))

(defn sounds []
  (-> sounds-dir
      list-files
      get-names
      normalized-map))

