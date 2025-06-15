import React, { useState } from 'react';
import axios from 'axios';
import '../AddWorkout.css'

const AddWorkout = () => {
  const [date, setDate] = useState('');
  const [exercises, setExercises] = useState([
    {
      name: '',
      notes: '',
      sets: [{ reps: '', weight: '' }]
    }
  ]);

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', notes: '', sets: [{ reps: '', weight: '' }] }]);
  };

  const addSet = (exerciseIndex) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets.push({ reps: '', weight: '' });
    setExercises(updated);
  };

  const removeExercise = (index) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    setExercises(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await API.post('/workouts', { date, exercises });
      alert('✅ Workout added successfully!');
      setDate('');
      setExercises([{ name: '', notes: '', sets: [{ reps: '', weight: '' }] }]);
    } catch (err) {
      alert('❌ Failed to add workout');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="container py-5 mainBody">
      <h2 className="text-center text-glow dashboard-heading mb-4">📝 Add Your Workout</h2>

      <form onSubmit={handleSubmit} className="p-4 card-3d shadow rounded-4 bg-dark text-light">

        <div className="mb-4">
          <label className="form-label fw-semibold">📅 Workout Date & Time:</label>
          <input
            type="datetime-local"
            className="form-control dark-mode-form"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {exercises.map((exercise, exerciseIndex) => (
          <div key={exerciseIndex} className="border p-4 mb-4 rounded bg-black text-light shadow-sm">

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0">🏋️ Exercise {exerciseIndex + 1}</h5>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm rounded-pill"
                onClick={() => removeExercise(exerciseIndex)}
              >
                ❌ Remove Exercise
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label">Exercise Name</label>
              <input
                type="text"
                className="form-control dark-mode-form"
                value={exercise.name}
                onChange={(e) => handleExerciseChange(exerciseIndex, 'name', e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Notes (optional)</label>
              <textarea
                className="form-control dark-mode-form"
                rows="2"
                value={exercise.notes}
                onChange={(e) => handleExerciseChange(exerciseIndex, 'notes', e.target.value)}
              />
            </div>

            <div>
              <h6 className="fw-semibold">Sets</h6>
              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="row g-2 mb-2 align-items-center">
                  <div className="col-md-5">
                    <input
                      type="number"
                      placeholder="Reps"
                      className="form-control dark-mode-form"
                      value={set.reps}
                      onChange={(e) =>
                        handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-md-5">
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      className="form-control dark-mode-form"
                      value={set.weight}
                      onChange={(e) =>
                        handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm w-100 rounded-pill"
                      onClick={() => removeSet(exerciseIndex, setIndex)}
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-info btn-sm mt-2 rounded-pill"
                onClick={() => addSet(exerciseIndex)}
              >
                ➕ Add Set
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline-warning mb-3 rounded-pill"
          onClick={addExercise}
        >
          ➕ Add Another Exercise
        </button>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-success px-5 py-2 rounded-pill fw-semibold">
            ✅ Save Workout
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkout;
