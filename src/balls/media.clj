(ns balls.media
  (:require [clojure.data.json :refer [read-str]]
            [clojure.java.io :refer [as-file file]]
            [clojure.string :as string]))

(def sounds-dir "resources/public/sounds")
(def videos-dir "resources/public/videos")

(def sound-web-path (partial str "/sounds/"))
(def video-web-path (partial str "/videos/"))

(defn- list-files [dir]
  #(-> dir file .listFiles))

(defn- get-names [files]
  (map #(.getName %) files))

(defn normalize-name [filename]
  (-> filename
      (string/split #"\.")
      first
      (string/replace #"_", " ")
      (string/replace #"\W", " ")
      (string/replace #"\s+", " ")))

(defn- normalized-map [web-path-fn filenames]
  (->> filenames
       (map (juxt normalize-name web-path-fn))
       sort
       (into {})))

(def sound-map (partial normalized-map sound-web-path))

(def video-map (partial normalized-map video-web-path))

(def all-sounds (comp sound-map get-names (list-files sounds-dir)))
(def all-videos (comp video-map get-names (list-files videos-dir)))