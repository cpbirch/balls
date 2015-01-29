(ns balls.data.go
  (:require [clj-cctray.core :as parser]))

(defn get-all-projects [url]
  {:projects (parser/get-projects url {:normalise :all :server :go})})