(ns balls.data.events)

(def default-red-alert-threshold 5)
(def default-glitch-effect-threshold 3)

(defn- count-over-threshold? [default-threshold threshold coll]
  (let [t (or threshold default-threshold)]
    (> (inc (count coll)) t 0)))

(def red-alert-over-threshold? (partial count-over-threshold? default-red-alert-threshold))
(def glitch-effect-over-threshold? (partial count-over-threshold? default-glitch-effect-threshold))

(defn- add-red-alert [red-alert-threshold {:keys [sick] :as grouped-pipelines}]
  (assoc grouped-pipelines :red-alert (red-alert-over-threshold? red-alert-threshold sick)))

(defn- add-glitch-effect [glitch-effect-threshold {:keys [sick] :as grouped-pipelines}]
  (assoc grouped-pipelines :glitch (glitch-effect-over-threshold? glitch-effect-threshold sick)))

(defn add-ui-events [{:keys [red-alert-threshold glitch-effect-threshold]} grouped-pipelines]
  (->> grouped-pipelines
      (add-red-alert red-alert-threshold)
      (add-glitch-effect glitch-effect-threshold)))
